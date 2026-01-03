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
    familyHistory: false,
    highBp: false,
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="-ml-2">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <span className="text-sm font-semibold text-muted-foreground">
            Risk Assessment
          </span>
          <div className="w-10" /> {/* Spacer */}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 p-6 pb-24 max-w-md mx-auto w-full">
        <AnimatePresence mode="wait">
          
          {step === 'demographics' && (
            <motion.div 
              key="demographics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">About You</h2>
                <p className="text-muted-foreground">Let's start with some basics.</p>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Age Range</label>
                <div className="grid grid-cols-1 gap-3">
                  {['18-44', '45-64', '65+'].map((age) => (
                    <button
                      key={age}
                      onClick={() => updateField('ageRange', age)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.ageRange === age
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 bg-white hover:border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{age} years</span>
                        {formData.ageRange === age && <Check className="w-5 h-5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium">Gender</label>
                <div className="flex gap-3">
                  {['Male', 'Female', 'Other'].map((g) => (
                    <button
                      key={g}
                      onClick={() => updateField('gender', g)}
                      className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all ${
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
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Medical History</h2>
                <p className="text-muted-foreground">These factors can influence risk.</p>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => updateField('familyHistory', !formData.familyHistory)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.familyHistory
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">Family History</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Do you have immediate family members (parents, siblings) with diabetes?
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.familyHistory ? 'border-primary bg-primary text-white' : 'border-slate-300'
                    }`}>
                      {formData.familyHistory && <Check className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => updateField('highBp', !formData.highBp)}
                  className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.highBp
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">High Blood Pressure</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Have you ever been diagnosed with hypertension?
                      </p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      formData.highBp ? 'border-primary bg-primary text-white' : 'border-slate-300'
                    }`}>
                      {formData.highBp && <Check className="w-4 h-4" />}
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
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Symptoms</h2>
                <p className="text-muted-foreground">Select any that you experience often.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
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
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      (formData.symptoms as string[])?.includes(symptom)
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 bg-white hover:border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{symptom}</span>
                      {(formData.symptoms as string[])?.includes(symptom) && <Check className="w-5 h-5" />}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100">
        <div className="max-w-md mx-auto">
          <Button 
            className="w-full text-lg shadow-lg" 
            size="lg"
            onClick={handleNext}
            disabled={
              (step === 'demographics' && (!formData.ageRange || !formData.gender))
            }
          >
            {step === 'symptoms' ? 'Continue to Measurement' : 'Next Step'} 
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
