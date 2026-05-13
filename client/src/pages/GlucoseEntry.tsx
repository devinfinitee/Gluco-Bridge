import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { CameraCapture } from "@/components/common/CameraCapture";
import { useAnalyzeImage } from "@/hooks/use-ai";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { validateGlucose } from "@/utils/validation";

export default function GlucoseEntry() {
  const [_, setLocation] = useLocation();
  const [view, setView] = useState<'manual' | 'camera'>('manual');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [timing, setTiming] = useState<'before' | 'after' | 'fasting' | 'bedtime'>('fasting');
  const [feeling, setFeeling] = useState<'good' | 'neutral' | 'sick'>('neutral');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const analyzeImageMutation = useAnalyzeImage();

  const handleNext = () => {
    const validation = validateGlucose(value, unit);
    
    if (!validation.isValid) {
      toast({
        title: "Invalid Input",
        description: validation.error || 'Please enter a valid glucose value',
        variant: "destructive",
      });
      return;
    }

    const existing = JSON.parse(localStorage.getItem('screeningData') || '{}');
    const completeData = {
      ...existing,
      glucoseValue: validation.value,
      glucoseUnit: unit,
      timing,
      feeling,
    };
    localStorage.setItem('screeningData', JSON.stringify(completeData));
    setLocation('/results');
  };

  const handleCameraCapture = async (imageData: string) => {
    setIsProcessing(true);
    try {
      const result = await analyzeImageMutation.mutateAsync({ image: imageData });
      
      if (result.value !== null && result.unit !== null) {
        const glucoseValue = result.value;
        const glucoseUnit = result.unit as 'mg/dL' | 'mmol/L';
        
        const validation = validateGlucose(glucoseValue, glucoseUnit);
        
        if (validation.isValid) {
          setValue(glucoseValue.toString());
          setUnit(glucoseUnit);
          setShowCamera(false);
          setView('manual');
          
          toast({
            title: "Success!",
            description: `Detected glucose value: ${glucoseValue} ${glucoseUnit}`,
          });
          return;
        } else {
          toast({
            title: "Invalid Reading",
            description: `Detected ${glucoseValue} ${glucoseUnit}, but ${validation.error}. Please verify and enter manually.`,
            variant: "destructive",
          });
          setValue(glucoseValue.toString());
          setUnit(glucoseUnit);
          setShowCamera(false);
          setView('manual');
          return;
        }
      }
      
      toast({
        title: "Detection failed",
        description: "Could not read the glucometer screen. Please enter manually.",
        variant: "destructive",
      });
      setShowCamera(false);
      setView('manual');
      
    } catch (error) {
      console.error("Failed to analyze glucometer:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to process image: ${errorMsg}. Please enter manually.`,
        variant: "destructive",
      });
      setShowCamera(false);
      setView('manual');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        await handleCameraCapture(base64);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to process file:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const feelingEmojis = [
    { id: 'good', emoji: '😊', label: 'Good' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'sick', emoji: '🤒', label: 'Sick' },
  ] as const;

  return (
    <main className="md:min-h-screen md:bg-background h-screen bg-background flex md:flex-col flex-col overflow-hidden md:overflow-visible">
      {showCamera && <CameraCapture onCapture={handleCameraCapture} isProcessing={isProcessing} />}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-container-max mx-auto px-4 md:px-8 py-4 md:py-8">
          {/* Desktop Title */}
          <div className="hidden md:block mb-6">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Glucose Data Entry</h2>
            <p className="text-on-surface-variant font-body-base">Choose your preferred method to sync your latest reading.</p>
          </div>

          {/* Desktop Camera + Upload Section */}
          <div className="hidden md:grid grid-cols-12 gap-gutter mb-10">
            <div className="col-span-7 lg:col-span-8 overflow-hidden rounded-xl bg-on-surface relative shadow-[0px_4px_20px_rgba(0,92,200,0.05)] h-[460px]">
              <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                  {isProcessing ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-4xl animate-spin">sync</span>
                      </div>
                      <p className="text-white/90 font-title-md">Analyzing glucometer image...</p>
                      <p className="text-white/60 text-body-sm">AI is reading the display values</p>
                    </motion.div>
                  ) : (
                    <>
                      <div className="relative w-64 h-40 border-2 border-white/20 rounded-lg mb-8">
                        <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-lg" />
                        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_#00459a] animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white/40 text-6xl">photo_camera</span>
                        </div>
                      </div>
                      <p className="text-white/70 text-body-sm mb-2">Upload a photo of your glucometer screen</p>
                    </>
                  )}
                </div>
              </div>

              {/* Hidden file input for desktop */}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />

              {!isProcessing && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10">
                  <button
                    onClick={() => setShowCamera(true)}
                    className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                    title="Use Camera"
                  >
                    <span className="material-symbols-outlined">photo_camera</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="bg-primary text-white px-8 py-4 rounded-full font-title-md flex items-center gap-2 shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">upload</span>
                    Upload Photo
                  </button>
                  <button
                    onClick={() => setShowCamera(true)}
                    className="bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                    title="Capture with Camera"
                  >
                    <span className="material-symbols-outlined">center_focus_strong</span>
                  </button>
                </div>
              )}
            </div>

            <div className="col-span-5 lg:col-span-4">
              <div className="glass-card p-6 rounded-xl h-full flex flex-col justify-between border border-primary/10 shadow-[0px_4px_20px_rgba(0,92,200,0.05)]">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">info</span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface">How to Scan</h3>
                  </div>
                  <ul className="space-y-6">
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[12px] font-bold">1</span>
                      <p className="text-on-surface-variant text-body-sm">Take a clear photo of your glucometer screen or upload an existing one.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[12px] font-bold">2</span>
                      <p className="text-on-surface-variant text-body-sm">Ensure the screen is well-lit and free of glare or reflections.</p>
                    </li>
                    <li className="flex gap-4">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center text-[12px] font-bold">3</span>
                      <p className="text-on-surface-variant text-body-sm">The AI will read the value and auto-fill the form below.</p>
                    </li>
                  </ul>
                </div>
                <div className="mt-8 pt-8 border-t border-outline-variant/30">
                  <p className="text-on-surface-variant text-body-sm mb-4 text-center">Prefer to type it in?</p>
                  <button
                    className="w-full py-4 border border-outline text-on-surface font-title-md rounded-xl hover:bg-surface-container-low transition-all active:scale-[0.98]"
                    onClick={() => {
                      const el = document.getElementById('desktop-manual-card');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Enter Manually
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Manual Card */}
          <div className="hidden md:block mt-10 max-w-md mx-auto">
            <div id="desktop-manual-card" className="glass-card p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,92,200,0.05)] border border-primary/10">
              <div className="text-center mb-8">
                <h3 className="font-title-md text-title-md text-primary mb-2">Manual Reading</h3>
                <p className="text-on-surface-variant text-body-sm">Please enter the precise mg/dL value from your meter.</p>
              </div>
              <div className="space-y-6">
                <div className="relative">
                  <label className="absolute -top-3 left-4 px-1 bg-white text-on-surface-variant text-[12px] font-semibold">Glucose Level</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="000"
                    className="w-full text-center text-[48px] font-bold py-6 border-2 border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-primary placeholder:text-surface-container-highest transition-all"
                  />
                  <span className="absolute bottom-4 right-6 text-on-surface-variant font-bold">mg/dL</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Time</label>
                    <input className="w-full p-3 border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none" type="time" defaultValue="14:30" />
                  </div>
                  <div className="relative">
                    <label className="block text-label-caps font-label-caps text-on-surface-variant mb-2">Meal State</label>
                    <select
                      value={timing}
                      onChange={(e) => setTiming(e.target.value as any)}
                      className="w-full p-3 border border-outline-variant rounded-lg focus:border-primary focus:ring-0 outline-none appearance-none bg-white cursor-pointer"
                    >
                      <option value="fasting">Fasting</option>
                      <option value="before">Pre-meal</option>
                      <option value="after">Post-meal</option>
                      <option value="bedtime">Bedtime</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleNext}
                  disabled={!value}
                  className="w-full py-4 bg-primary text-white font-title-md rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save Reading
                </button>
              </div>
            </div>
          </div>

          {/* View Switcher Tabs */}
          <div className="md:hidden bg-surface-container flex p-1 rounded-lg mb-6 border border-outline-variant/20">
            <button 
              onClick={() => setView('manual')}
              className={`flex-1 py-2 px-4 rounded-md text-body-sm font-body-base transition-all ${
                view === 'manual' 
                  ? 'bg-surface text-primary shadow-sm font-semibold' 
                  : 'text-on-surface-variant'
              }`}
            >
              Manual Entry
            </button>
            <button 
              onClick={() => setView('camera')}
              className={`flex-1 py-2 px-4 rounded-md text-body-sm font-body-base transition-all ${
                view === 'camera' 
                  ? 'bg-surface text-primary shadow-sm font-semibold' 
                  : 'text-on-surface-variant'
              }`}
            >
              Camera Scan
            </button>
          </div>

          {/* Manual Entry Section */}
          {view === 'manual' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden space-y-4"
            >
              {/* Glucose Input Card */}
              <div className="bg-surface border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                  <label className="text-title-md font-title-md text-on-surface">Glucose Value</label>
                  <div className="flex bg-secondary-fixed rounded-full p-1">
                    <button 
                      onClick={() => setUnit('mg/dL')}
                      className={`px-3 py-0.5 rounded-full text-label-caps transition-all text-sm ${
                        unit === 'mg/dL' 
                          ? 'bg-surface text-primary shadow-sm' 
                          : 'text-on-secondary-fixed-variant'
                      }`}
                    >
                      mg/dL
                    </button>
                    <button 
                      onClick={() => setUnit('mmol/L')}
                      className={`px-3 py-0.5 rounded-full text-label-caps transition-all text-sm ${
                        unit === 'mmol/L' 
                          ? 'bg-surface text-primary shadow-sm' 
                          : 'text-on-secondary-fixed-variant'
                      }`}
                    >
                      mmol/L
                    </button>
                  </div>
                </div>

                {/* Large Input Display */}
                <div className="flex items-center justify-center py-4 border-b border-outline-variant/20">
                  <input 
                    type="number" 
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="000" 
                    className="w-full text-center text-primary font-display-xl text-5xl bg-transparent border-none focus:ring-0 placeholder:text-outline-variant/40 outline-none"
                  />
                </div>

                {/* Timing & Feeling Grid */}
                <div className="grid grid-cols-2 gap-4 mt-5">
                  {/* Timing */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-caps text-on-surface-variant font-label-caps text-xs">Timing</label>
                    <select 
                      value={timing}
                      onChange={(e) => setTiming(e.target.value as any)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg text-body-sm text-on-surface p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer font-body-sm"
                    >
                      <option value="before">Before Meal</option>
                      <option value="after">After Meal</option>
                      <option value="fasting">Fasting</option>
                      <option value="bedtime">Bedtime</option>
                    </select>
                  </div>

                  {/* Feeling */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-label-caps text-on-surface-variant font-label-caps text-xs">Feeling</label>
                    <div className="flex gap-1.5">
                      {feelingEmojis.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setFeeling(f.id)}
                          className={`flex-1 p-2 rounded-lg text-lg transition-all ${
                            feeling === f.id 
                              ? 'bg-primary shadow-md' 
                              : 'bg-surface-container-low hover:bg-surface-container'
                          }`}
                        >
                          {f.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* History Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-high rounded-xl p-3 border border-outline-variant/20">
                  <span className="text-label-caps text-on-surface-variant font-label-caps block mb-2 text-xs">LAST ENTRY</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-title-md text-primary font-title-md">98</span>
                    <span className="text-body-sm text-on-surface-variant text-xs">mg/dL</span>
                  </div>
                  <span className="text-body-sm text-on-surface-variant block mt-1 text-xs">2h ago</span>
                </div>

                <div className="bg-secondary-container rounded-xl p-3 border border-outline-variant/20">
                  <span className="text-label-caps text-on-secondary-fixed-variant font-label-caps block mb-2 text-xs">AVG 7D</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-title-md text-on-secondary-fixed font-title-md">112</span>
                    <span className="text-body-sm text-on-secondary-fixed-variant text-xs">mg/dL</span>
                  </div>
                  <div className="w-full bg-white/40 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-primary w-3/4 h-full rounded-full" />
                  </div>
                </div>
              </div>

              {/* Log Button */}
              <button 
                onClick={handleNext}
                disabled={!value}
                className="w-full bg-primary text-on-primary py-3 rounded-lg font-title-md font-semibold shadow-lg active:scale-95 duration-200 transition-transform disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl flex items-center justify-center gap-2 group text-sm"
              >
                Log Glucose Level
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>

              {/* Privacy Message */}
              <div className="text-center">
                <p className="text-body-sm text-on-surface-variant flex items-center justify-center gap-1 text-xs">
                  <span className="material-symbols-outlined text-outline text-base">lock</span>
                  Your data is encrypted and used only for glucose tracking.
                </p>
              </div>
            </motion.section>
          )}

          {/* Camera Section */}
          {view === 'camera' && (
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden space-y-4"
            >
              <div className="bg-surface border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-primary text-4xl">
                    {isProcessing ? 'sync' : 'photo_camera'}
                  </span>
                </div>

                <h3 className="text-title-md font-title-md mb-1 text-sm">Take a Photo</h3>
                <p className="text-body-sm text-on-surface-variant mb-6 max-w-xs text-xs">
                  Snap a clear picture of your glucometer screen.
                </p>

                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                />

                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => setShowCamera(true)}
                    disabled={isProcessing}
                    className="bg-primary text-on-primary py-2 rounded-lg font-label-caps text-label-caps font-semibold active:scale-95 transition-transform disabled:opacity-50 hover:shadow-lg text-xs"
                  >
                    {isProcessing ? 'Analyzing...' : 'Take Photo'}
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                    className="border border-primary bg-surface text-primary py-2 rounded-lg font-label-caps text-label-caps font-semibold active:scale-95 transition-transform disabled:opacity-50 hover:bg-surface-container-low text-xs"
                  >
                    Upload Photo
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </div>
      </div>


    </main>
  );
}