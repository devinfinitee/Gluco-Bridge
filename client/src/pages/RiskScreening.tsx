import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { InsertScreening } from "@shared/schema";

type Step = 'demographics' | 'history' | 'symptoms';

export default function RiskScreening() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('demographics');
  const [progress, setProgress] = useState(33);
  
  const [formData, setFormData] = useState<Partial<InsertScreening>>({
    symptoms: [],
    familyHistory: 'no',
    highBp: 'no',
  });

  const handleNext = () => {
    if (step === 'demographics') {
      setStep('history');
      setProgress(66);
    } else if (step === 'history') {
      setStep('symptoms');
      setProgress(100);
    } else {
      // Save to localStorage to persist between pages without backend for now
      localStorage.setItem('screeningData', JSON.stringify(formData));
      setLocation('/glucose');
    }
  };

  const updateField = (field: keyof InsertScreening, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSymptom = (symptom: string) => {
    const current = (formData.symptoms as string[]) || [];
    const updated = current.includes(symptom)
      ? current.filter(s => s !== symptom)
      : [...current, symptom];
    updateField('symptoms', updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
      <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="-ml-2 h-8 w-8">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-xs font-semibold text-muted-foreground">
            Know Your Risk
          </span>
          <div className="w-8" /> {/* Spacer */}
        </div>
        
        <div className="mb-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-900">💡 Early Detection Saves Lives</p>
        </div>

        <Progress value={progress} className="h-1.5" />
      </div>

      <div className="flex-1 px-4 py-4 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {step === 'demographics' && (
            <motion.div 
              key="demographics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Know Your Baseline</h2>
                <p className="text-sm text-muted-foreground">Basic information helps us assess your risk.</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                <p className="text-xs font-bold text-red-900">🚨 CRITICAL</p>
                <p className="text-xs text-red-800">Type 2 diabetes has NO early symptoms. You could be at risk right now.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Age Range</label>
                <div className="grid grid-cols-3 gap-2">
                  {['18-44', '45-64', '65+'].map((age) => (
                    <button
                      key={age}
                      onClick={() => updateField('ageRange', age)}
                      className={`py-2 px-2 rounded-lg border-2 text-xs text-center font-semibold transition-all ${
                        formData.ageRange === age
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gender</label>
                <div className="flex gap-2">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => updateField('gender', g)}
                      className={`flex-1 py-2 px-2 rounded-lg border-2 text-xs font-semibold transition-all ${
                        formData.gender === g
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Your Health Background</h2>
                <p className="text-sm text-muted-foreground">Quick yes/no questions. These factors increase your risk.</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-1">
                <p className="text-xs font-bold text-orange-900">⚠️ IMPORTANT</p>
                <p className="text-xs text-orange-800">Family history increases risk by 50%. High BP can triple your risk.</p>
              </div>

              <div className="space-y-2">
                <div 
                  onClick={() => updateField('familyHistory', formData.familyHistory === 'yes' ? 'no' : 'yes')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.familyHistory === 'yes'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">Family History of Diabetes?</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Parents or siblings with diabetes?
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.familyHistory === 'yes' ? 'border-primary bg-primary text-white' : 'border-slate-300'
                    }`}>
                      {formData.familyHistory === 'yes' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => updateField('highBp', formData.highBp === 'yes' ? 'no' : 'yes')}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.highBp === 'yes'
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-sm">High Blood Pressure?</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Ever diagnosed with hypertension?
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      formData.highBp === 'yes' ? 'border-primary bg-primary text-white' : 'border-slate-300'
                    }`}>
                      {formData.highBp === 'yes' && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'symptoms' && (
            <motion.div 
              key="symptoms"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl font-bold mb-1">Current Symptoms</h2>
                <p className="text-sm text-muted-foreground">Do you experience any warning signs?</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                <p className="text-xs font-bold text-yellow-900">⚠️ NOTE</p>
                <p className="text-xs text-yellow-800">Even without symptoms, diabetes can develop silently.</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  'Increased Thirst',
                  'Frequent Urination',
                  'Extreme Hunger',
                  'Unexplained Weight Loss',
                  'Fatigue',
                  'Blurry Vision'
                ].map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-2 rounded-lg border-2 text-left transition-all text-xs font-medium ${
                      (formData.symptoms as string[])?.includes(symptom)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span>{symptom}</span>
                      {(formData.symptoms as string[])?.includes(symptom) && <Check className="w-3 h-3" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
        <div className="max-w-md mx-auto">
          <Button 
            className="w-full text-base shadow-lg" 
            size="lg"
            onClick={handleNext}
            disabled={
              (step === 'demographics' && (!formData.ageRange || !formData.gender))
            }
          >
            {step === 'symptoms' ? 'Continue to Measurement' : 'Next Step'} 
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
