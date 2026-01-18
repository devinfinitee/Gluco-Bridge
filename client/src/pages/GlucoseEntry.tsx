import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, RefreshCcw, Loader2, AlertCircle, AlertTriangle } from "lucide-react";
import { CameraCapture } from "@/components/common/CameraCapture";
import { useAnalyzeImage } from "@/hooks/use-ai";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { validateGlucose } from "@/utils/validation";

export default function GlucoseEntry() {
  const [_, setLocation] = useLocation();
  const [mode, setMode] = useState<'manual' | 'camera'>('manual');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'mg/dL' | 'mmol/L'>('mg/dL');
  const [testType, setTestType] = useState<'fasting' | 'random'>('random');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [validationError, setValidationError] = useState<string>('');
  const [validationWarning, setValidationWarning] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const analyzeImageMutation = useAnalyzeImage();

  const handleNext = () => {
    // Validate glucose input
    const validation = validateGlucose(value, unit);
    
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid glucose value');
      toast({
        title: "Invalid Input",
        description: validation.error || 'Please enter a valid glucose value',
        variant: "destructive",
      });
      return;
    }

    // Clear error and proceed
    setValidationError('');
    const existing = JSON.parse(localStorage.getItem('screeningData') || '{}');
    const completeData = {
      ...existing,
      glucoseValue: validation.value,
      glucoseUnit: unit,
      testType
    };
    localStorage.setItem('screeningData', JSON.stringify(completeData));
    setLocation('/results');
  };

  const handleCameraCapture = async (imageData: string) => {
    setIsProcessing(true);
    try {
      console.log('Analyzing glucometer with serverless API...');
      
      const result = await analyzeImageMutation.mutateAsync({ image: imageData });
      
      if (result.value !== null && result.unit !== null) {
        const glucoseValue = result.value;
        const glucoseUnit = result.unit as 'mg/dL' | 'mmol/L';
        
        // Validate the extracted value
        const validation = validateGlucose(glucoseValue, glucoseUnit);
        
        if (validation.isValid) {
          setValue(glucoseValue.toString());
          setUnit(glucoseUnit);
          setShowCamera(false);
          setMode('manual');
          
          // Show success with warning if present
          if (validation.warning) {
            toast({
              title: "Reading Detected",
              description: `${glucoseValue} ${glucoseUnit} - ${validation.warning}`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Success!",
              description: `Detected glucose value: ${glucoseValue} ${glucoseUnit}`,
            });
          }
          return;
        } else {
          // Value parsed but validation failed - let user know
          toast({
            title: "Invalid Reading",
            description: `Detected ${glucoseValue} ${glucoseUnit}, but ${validation.error}. Please verify and enter manually.`,
            variant: "destructive",
          });
          setValue(glucoseValue.toString());
          setUnit(glucoseUnit);
          setShowCamera(false);
          setMode('manual');
          return;
        }
      }
      
      // API couldn't read the image
      toast({
        title: "Detection failed",
        description: "Could not read the glucometer screen. Please enter manually.",
        variant: "destructive",
      });
      setShowCamera(false);
      setMode('manual');
      
    } catch (error) {
      console.error("Failed to analyze glucometer:", error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: "Error",
        description: `Failed to process image: ${errorMsg}. Please enter manually.`,
        variant: "destructive",
      });
      setShowCamera(false);
      setMode('manual');
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

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col max-w-md mx-auto">
      {showCamera && (
        <CameraCapture 
          onCapture={handleCameraCapture}
          isProcessing={isProcessing}
        />
      )}

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
                   onChange={(e) => {
                     setValue(e.target.value);
                     setValidationError('');
                     setValidationWarning('');
                     if (e.target.value) {
                       const validation = validateGlucose(e.target.value, unit);
                       if (!validation.isValid) {
                         setValidationError(validation.error || '');
                       } else if (validation.warning) {
                         setValidationWarning(validation.warning);
                       }
                     }
                   }}
                   className={`text-4xl h-20 rounded-2xl text-center font-display font-bold ${
                     validationError ? 'border-red-500 border-2' : validationWarning ? 'border-orange-500 border-2' : ''
                   }`}
                   min="0"
                   step="0.1"
                 />
                 <button
                   onClick={() => setUnit(unit === 'mg/dL' ? 'mmol/L' : 'mg/dL')}
                   className="h-20 w-24 rounded-2xl bg-slate-100 font-semibold text-slate-600 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform"
                 >
                   <RefreshCcw className="w-4 h-4 opacity-50" />
                   {unit}
                 </button>
               </div>
               {validationError && (
                 <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                   <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                   <p className="text-sm text-red-600">{validationError}</p>
                 </div>
               )}
               {validationWarning && !validationError && (
                 <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                   <AlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0" />
                   <p className="text-sm text-orange-600">{validationWarning}</p>
                 </div>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center relative overflow-hidden">
              {isProcessing ? (
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
              onChange={(e) => handleImageUpload(e)}
            />

            <div className="grid grid-cols-2 gap-3 w-full">
              <Button
                size="lg"
                className="w-full"
                disabled={isProcessing}
                onClick={() => setShowCamera(true)}
              >
                {isProcessing ? 'Analyzing...' : 'Take Photo'}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full"
                disabled={isProcessing}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {mode === 'manual' && (
        <div className="mt-8">
          <Button 
            size="lg" 
            className="w-full text-lg h-14 shadow-lg shadow-blue-500/20" 
            onClick={handleNext}
            disabled={!value || !!validationError}
          >
            See Results
          </Button>
        </div>
      )}
    </div>
  );
}