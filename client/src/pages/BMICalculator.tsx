import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, ArrowRight, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { calculateBMI, validateBMIInputs } from "@/utils/validation";
import type { BMIResult } from "@/utils/validation";

export default function BMICalculator() {
  const [_, setLocation] = useLocation();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [bmiResult, setBmiResult] = useState<BMIResult | null>(null);
  const [validationError, setValidationError] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const { toast } = useToast();

  // Convert weight to kg if needed
  const getWeightInKg = (w: number, unit: 'kg' | 'lbs'): number => {
    return unit === 'lbs' ? w * 0.453592 : w;
  };

  // Convert height to cm if needed
  const getHeightInCm = (h: number, unit: 'cm' | 'ft'): number => {
    return unit === 'ft' ? h * 30.48 : h;
  };

  const handleCalculate = () => {
    setValidationError('');
    
    const weightInKg = weight ? getWeightInKg(parseFloat(weight), weightUnit) : 0;
    const heightInCm = height ? getHeightInCm(parseFloat(height), heightUnit) : 0;

    const validation = validateBMIInputs(weightInKg, heightInCm);
    if (!validation.isValid) {
      setValidationError(validation.error || 'Invalid input');
      toast({
        title: "Invalid Input",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    try {
      const result = calculateBMI(validation.weight!, validation.height!);
      setBmiResult(result);
      
      toast({
        title: "BMI Calculated",
        description: `Your BMI is ${result.bmi} (${result.categoryDisplay})`,
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to calculate BMI';
      setValidationError(errorMsg);
      toast({
        title: "Calculation Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleNext = () => {
    if (!bmiResult) {
      toast({
        title: "Calculate BMI First",
        description: "Please calculate your BMI before proceeding",
        variant: "destructive",
      });
      return;
    }

    const existing = JSON.parse(localStorage.getItem('screeningData') || '{}');
    const completeData = {
      ...existing,
      bmi: bmiResult.bmi,
      bmiCategory: bmiResult.category,
      weight: weight,
      height: height,
      weightUnit,
      heightUnit
    };
    localStorage.setItem('screeningData', JSON.stringify(completeData));
    setLocation('/results');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col max-w-md mx-auto pb-28">
      <h1 className="text-2xl font-bold mb-1 mt-6">BMI Calculator</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Calculate your Body Mass Index to assess your health.
      </p>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1 flex flex-col">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Weight Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Weight</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setBmiResult(null);
                  setValidationError('');
                }}
                className="flex-1 text-base h-12 rounded-lg"
                min="0"
                step="0.1"
              />
              <button
                onClick={() => setWeightUnit(weightUnit === 'kg' ? 'lbs' : 'kg')}
                className="h-12 w-16 rounded-lg bg-slate-100 font-semibold text-xs text-slate-600 flex items-center justify-center active:scale-95 transition-transform"
              >
                {weightUnit}
              </button>
            </div>
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Height</label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter height"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setBmiResult(null);
                  setValidationError('');
                }}
                className="flex-1 text-base h-12 rounded-lg"
                min="0"
                step="0.1"
              />
              <button
                onClick={() => setHeightUnit(heightUnit === 'cm' ? 'ft' : 'cm')}
                className="h-12 w-16 rounded-lg bg-slate-100 font-semibold text-xs text-slate-600 flex items-center justify-center active:scale-95 transition-transform"
              >
                {heightUnit}
              </button>
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-600">{validationError}</p>
            </div>
          )}

          {/* Calculate Button */}
          <Button
            size="lg"
            className="w-full text-base h-12"
            onClick={handleCalculate}
            disabled={!weight || !height}
          >
            Calculate BMI
          </Button>

          {/* BMI Result */}
          {bmiResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border-2 ${bmiResult.color}`}
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{bmiResult.bmi}</h3>
                  <p className="font-semibold text-sm mb-1">{bmiResult.categoryDisplay}</p>
                  <p className="text-xs opacity-90">{bmiResult.description}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* BMI Info Toggle */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Info className="w-4 h-4" />
            <span className="text-xs font-semibold">{showInfo ? 'Hide' : 'Learn'} BMI Facts</span>
          </button>

          {/* BMI Information */}
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2"
            >
              <p className="text-xs font-bold text-blue-900">What is BMI?</p>
              <div className="text-xs text-blue-800 space-y-2">
                <p><strong>BMI = Weight (kg) ÷ Height² (m²)</strong></p>
                <div className="space-y-1">
                  <p><strong className="text-blue-900">Underweight:</strong> BMI &lt; 18.5 (May lack immunity)</p>
                  <p><strong className="text-blue-900">Normal:</strong> BMI 18.5-24.9 (Healthy range)</p>
                  <p><strong className="text-blue-900">Overweight:</strong> BMI 25-29.9 (Increased health risk)</p>
                  <p><strong className="text-blue-900">Obese:</strong> BMI 30+ (Higher diabetes/heart risk)</p>
                </div>
                <p className="pt-2 border-t border-blue-200"><strong>💡 Important:</strong> BMI is a screening tool. It doesn't measure body fat directly. Athletes may have high BMI but be healthy. For accurate assessment, consult your doctor.</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-4 space-y-2 fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        {bmiResult && (
          <Button
            size="lg"
            className="w-full text-base h-12 shadow-lg shadow-blue-500/20"
            onClick={handleNext}
          >
            Continue
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        <Button
          size="lg"
          variant="outline"
          className="w-full text-base h-12"
          onClick={() => setLocation('/')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
