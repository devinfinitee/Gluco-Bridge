import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, RefreshCcw, Loader2 } from "lucide-react";
import { useAnalyzeImage } from "@/hooks/use-ai";
import { motion } from "framer-motion";

export default function GlucoseEntry() {
  const [_, setLocation] = useLocation();
  const [mode, setMode] = useState<'manual' | 'camera'>('manual');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [testType, setTestType] = useState<'fasting' | 'random'>('random');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const analyzeImage = useAnalyzeImage();

  const handleNext = () => {
    // Merge existing data
    const existing = JSON.parse(localStorage.getItem('screeningData') || '{}');
    const completeData = {
      ...existing,
      glucoseValue: parseFloat(value),
      glucoseUnit: unit,
      testType
    };
    localStorage.setItem('screeningData', JSON.stringify(completeData));
    setLocation('/results');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const result = await analyzeImage.mutateAsync({ image: base64 });
        if (result.value) {
          setValue(result.value.toString());
          if (result.unit) setUnit(result.unit as any);
          setMode('manual'); // Switch to manual to show extracted value
        }
      } catch (error) {
        console.error("Failed to analyze", error);
        alert("Could not read value from image. Please enter manually.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-2 mt-8">Glucose Entry</h1>
      <p className="text-muted-foreground mb-8">
        Enter your latest blood glucose reading.
      </p>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200 flex mb-8">
        <button
          onClick={() => setMode('manual')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            mode === 'manual' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setMode('camera')}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
            mode === 'camera' ? 'bg-primary text-white shadow-md' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Scan Monitor
        </button>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex-1 flex flex-col">
        
        {mode === 'manual' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Test Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTestType('fasting')}
                  className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                    testType === 'fasting'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-100'
                  }`}
                >
                  Fasting
                  <span className="block text-xs font-normal opacity-70 mt-1">No food 8h+</span>
                </button>
                <button
                  onClick={() => setTestType('random')}
                  className={`p-3 rounded-xl border-2 text-center font-medium transition-all ${
                    testType === 'random'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-slate-100'
                  }`}
                >
                  Random
                  <span className="block text-xs font-normal opacity-70 mt-1">Any time</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Reading</label>
               <div className="flex items-center gap-2">
                 <Input
                   type="number"
                   placeholder="0"
                   value={value}
                   onChange={(e) => setValue(e.target.value)}
                   className="text-4xl h-20 rounded-2xl text-center font-display font-bold"
                 />
                 <button
                   onClick={() => setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL')}
                   className="h-20 w-24 rounded-2xl bg-slate-100 font-semibold text-slate-600 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                 >
                   <RefreshCcw className="w-4 h-4 opacity-50" />
                   {unit}
                 </button>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative overflow-hidden">
              {analyzeImage.isPending ? (
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              ) : (
                <Camera className="w-10 h-10 text-primary" />
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-bold">Take a Photo</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[200px] mx-auto">
                Snap a clear picture of your glucometer screen.
              </p>
            </div>

            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            
            <Button 
              size="lg" 
              className="w-full" 
              disabled={analyzeImage.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {analyzeImage.isPending ? 'Analyzing...' : 'Open Camera'}
            </Button>
          </motion.div>
        )}
      </div>

      {mode === 'manual' && (
        <div className="mt-8">
          <Button 
            size="lg" 
            className="w-full text-lg h-14 shadow-lg shadow-blue-500/20" 
            onClick={handleNext}
            disabled={!value}
          >
            See Results
          </Button>
        </div>
      )}
    </div>
  );
}
