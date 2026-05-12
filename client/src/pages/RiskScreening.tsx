import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { InsertScreening } from "@shared/schema";

type Step = 'demographics' | 'history' | 'symptoms';

export default function RiskScreening() {
  const [_, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('demographics');
  
  const [formData, setFormData] = useState<Partial<InsertScreening>>({
    symptoms: [],
    familyHistory: 'no',
    highBp: 'no',
    activityLevel: 'active',
  });

  const handleNext = () => {
    if (step === 'demographics') {
      setStep('history');
    } else if (step === 'history') {
      setStep('symptoms');
    } else {
      localStorage.setItem('screeningData', JSON.stringify(formData));
      setLocation('/glucose');
    }
  };

  const updateField = (field: keyof InsertScreening, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStepNumber = () => {
    if (step === 'demographics') return 1;
    if (step === 'history') return 2;
    return 3;
  };

  const getProgressWidth = () => {
    if (step === 'demographics') return '33.33%';
    if (step === 'history') return '66.66%';
    return '100%';
  };

  const getStepTitle = () => {
    if (step === 'demographics') return 'Personal Information';
    if (step === 'history') return 'Health History';
    return 'Current Symptoms';
  };

  const activityOptions = [
    { value: 'sedentary', label: 'Sedentary', desc: 'Desk job, little to no exercise.' },
    { value: 'active', label: 'Active', desc: 'Moderate exercise 3-5 days/week.' },
    { value: 'athletic', label: 'Athletic', desc: 'High intensity training or physical labor.' },
  ];

  return (
    <main className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Progress Bar Section */}
      <nav className="flex-shrink-0 bg-surface-container-low px-4 py-3 border-b border-outline-variant/20">
        <div className="flex justify-between items-center mb-2">
          <span className="font-label-caps text-label-caps text-primary">Step {getStepNumber()} of 3</span>
          <span className="font-label-caps text-label-caps text-on-surface-variant">{getStepTitle()}</span>
        </div>
        <div className="w-full bg-outline-variant/30 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="bg-primary h-full rounded-full"
            initial={{ width: '33.33%' }}
            animate={{ width: getProgressWidth() }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 md:px-6 pt-4 pb-28 md:pb-24 max-w-2xl md:max-w-3xl mx-auto">
          {/* Step Title */}
          <section className="mb-6 hidden md:block">
            <h2 className="text-headline-lg font-headline-lg text-on-surface mb-2">Personal Information</h2>
            <p className="text-body-base text-on-surface-variant">We need a few details to calculate your metabolic risk score accurately.</p>
          </section>

          <section className="mb-6 md:hidden">
            <h2 className="text-headline-lg-mobile font-headline-lg text-on-surface mb-2">Tell us about yourself</h2>
            <p className="text-body-base text-on-surface-variant">We use this data to provide a baseline risk assessment for metabolic health.</p>
          </section>

          <AnimatePresence mode="wait">
            {step === 'demographics' && (
              <motion.div
                key="demographics"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Desktop Form */}
                <form className="hidden md:block space-y-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">Age</label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest outline-none transition-all"
                          placeholder="e.g. 35"
                          type="number"
                          onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-outline">years</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">Activity Level</label>
                      <select
                        className="w-full px-4 py-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest text-on-surface outline-none transition-all appearance-none cursor-pointer"
                        onChange={(e) => updateField('activityLevel', e.target.value)}
                        value={formData.activityLevel || 'active'}
                      >
                        <option value="sedentary">Sedentary</option>
                        <option value="active">Active</option>
                        <option value="athletic">Athletic</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">Height</label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest outline-none transition-all"
                          placeholder="e.g. 175"
                          type="number"
                          onChange={(e) => updateField('height' as keyof InsertScreening, parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-outline">cm</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-label-caps text-on-surface-variant">Weight</label>
                      <div className="relative">
                        <input
                          className="w-full px-4 py-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary focus:border-transparent bg-surface-container-lowest outline-none transition-all"
                          placeholder="e.g. 72"
                          type="number"
                          onChange={(e) => updateField('weight', parseInt(e.target.value) || 0)}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-outline">kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-4 rounded-xl border border-primary/10 flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      <span className="material-symbols-outlined">monitor_heart</span>
                    </div>
                    <div>
                      <h4 className="font-label-caps text-label-caps text-primary">Why this matters</h4>
                      <p className="text-body-sm text-on-surface-variant">Body mass and activity levels are primary indicators for insulin sensitivity patterns.</p>
                    </div>
                  </div>
                </form>

                {/* Mobile Form */}
                <div className="md:hidden bg-surface rounded-xl p-4 border border-outline-variant/30 shadow-sm mb-6 space-y-4">
                  {/* Age */}
                  <div className="space-y-2">
                    <label className="text-body-base text-on-surface flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-primary">calendar_today</span>
                      What is your age?
                    </label>
                    <input 
                      className="w-full p-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-container-lowest text-on-surface text-body-sm outline-none transition-all"
                      placeholder="e.g. 35"
                      type="number"
                      onChange={(e) => updateField('age', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <label className="text-body-base text-on-surface flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-primary">monitor_weight</span>
                      Current weight (kg)
                    </label>
                    <input 
                      className="w-full p-3 rounded-lg border border-outline focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-container-lowest text-on-surface text-body-sm outline-none transition-all"
                      placeholder="e.g. 75"
                      type="number"
                      onChange={(e) => updateField('weight', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  {/* Activity Level */}
                  <div className="space-y-2">
                    <label className="text-body-base text-on-surface flex items-center gap-2 font-semibold">
                      <span className="material-symbols-outlined text-primary">directions_run</span>
                      Daily activity level
                    </label>
                    <div className="space-y-2">
                      {activityOptions.map((option) => (
                        <label 
                          key={option.value}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.activityLevel === option.value
                              ? 'border-primary bg-primary-container/10'
                              : 'border-outline-variant hover:bg-secondary-container/10'
                          }`}
                        >
                          <input
                            type="radio"
                            name="activity"
                            value={option.value}
                            checked={formData.activityLevel === option.value}
                            onChange={(e) => updateField('activityLevel', e.target.value)}
                            className="w-5 h-5 cursor-pointer"
                          />
                          <div className="ml-3">
                            <p className="text-body-base font-semibold text-on-surface">{option.label}</p>
                            <p className="text-body-sm text-on-surface-variant">{option.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Visual Context Card */}
                <div className="md:hidden relative rounded-2xl overflow-hidden aspect-video flex items-center justify-center bg-surface-container-high mb-6">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-JO2aZiRO4yf2QE5RTzWjKDNi4LmBQQ2H46ctWirc3UAn9f9kFsikCpHyG4je3SYytXdNUYjCDfCrHbGloBxsrQWCnOJF0nw39GHQu4dh5iPQifjRUgDKIjym54rBpB0tWuu3J8x3du46DceuW2QvHyDBiIMaFE7SjQ0AZxBO3vWVPcJHxQkhqdl1rsiDFSDdo_V9WLrhoPIZ-tgAbGwc-XRqABLhnoznezodFg6UlzEPf70PBxMJC5HD_vTGttzigia0UFL3kA"
                    alt="Fitness tracker on wrist"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                  <div className="relative z-10 p-4 text-center">
                    <p className="text-white text-body-base font-semibold italic">"Precision is the first step toward lasting health."</p>
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
                transition={{ duration: 0.3 }}
              >
                <div className="bg-surface rounded-xl p-4 border border-outline-variant/30 shadow-sm mb-6 space-y-4">
                  <div className="space-y-3">
                    <h3 className="text-body-base font-semibold text-on-surface">Family History</h3>
                    <label className="flex items-center p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-secondary-container/10 transition-all">
                      <input
                        type="radio"
                        checked={formData.familyHistory === 'no'}
                        onChange={() => updateField('familyHistory', 'no')}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="ml-3 text-body-sm text-on-surface">No history of diabetes</span>
                    </label>
                    <label className="flex items-center p-3 border border-primary bg-primary-container/10 rounded-lg cursor-pointer transition-all">
                      <input
                        type="radio"
                        checked={formData.familyHistory === 'yes'}
                        onChange={() => updateField('familyHistory', 'yes')}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="ml-3 text-body-sm text-on-surface">Yes, diabetes in family</span>
                    </label>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-outline-variant/20">
                    <h3 className="text-body-base font-semibold text-on-surface">High Blood Pressure</h3>
                    <label className="flex items-center p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-secondary-container/10 transition-all">
                      <input
                        type="radio"
                        checked={formData.highBp === 'no'}
                        onChange={() => updateField('highBp', 'no')}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="ml-3 text-body-sm text-on-surface">No high blood pressure</span>
                    </label>
                    <label className="flex items-center p-3 border border-primary bg-primary-container/10 rounded-lg cursor-pointer transition-all">
                      <input
                        type="radio"
                        checked={formData.highBp === 'yes'}
                        onChange={() => updateField('highBp', 'yes')}
                        className="w-5 h-5 cursor-pointer"
                      />
                      <span className="ml-3 text-body-sm text-on-surface">Yes, I have high blood pressure</span>
                    </label>
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
                transition={{ duration: 0.3 }}
              >
                <div className="bg-surface rounded-xl p-4 border border-outline-variant/30 shadow-sm">
                  <h3 className="text-body-base font-semibold text-on-surface mb-4">Any recent symptoms?</h3>
                  <div className="space-y-2">
                    {['Increased Thirst', 'Frequent Urination', 'Extreme Hunger', 'Unexplained Weight Loss', 'Fatigue', 'Blurry Vision'].map((symptom) => (
                      <label key={symptom} className="flex items-center p-3 border border-outline-variant rounded-lg cursor-pointer hover:bg-secondary-container/10 transition-all">
                        <input
                          type="checkbox"
                          checked={(formData.symptoms as string[])?.includes(symptom) || false}
                          onChange={(e) => {
                            const current = (formData.symptoms as string[]) || [];
                            const updated = e.target.checked
                              ? [...current, symptom]
                              : current.filter(s => s !== symptom);
                            updateField('symptoms', updated);
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <span className="ml-3 text-body-sm text-on-surface">{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom CTA Button */}
      <footer className="flex-shrink-0 bg-surface/80 backdrop-blur-sm border-t border-outline-variant/30 p-4 md:p-6">
        <button 
          onClick={handleNext}
          className="w-full bg-primary text-on-primary py-3 rounded-lg font-title-md font-semibold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all hover:shadow-xl"
        >
          {step === 'symptoms' ? 'Complete Screening' : 'Next'}
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </main>
  );
}
