export type RiskLevel = 'normal' | 'prediabetes' | 'diabetes' | 'unknown';

interface Interpretation {
  level: RiskLevel;
  title: string;
  color: string;
  description: string;
}

export function interpretGlucose(value: number, unit: string, type: 'fasting' | 'random'): Interpretation {
  // Normalize to mg/dL for calculation
  // 1 mmol/L = 18 mg/dL
  const normalizedValue = unit === 'mmol/L' ? value * 18 : value;

  if (type === 'fasting') {
    if (normalizedValue >= 126) {
      return {
        level: 'diabetes',
        title: 'High Range (Possible Diabetes)',
        color: 'text-red-600 bg-red-50 border-red-200',
        description: 'Your reading suggests levels often associated with diabetes. Please consult a healthcare provider for confirmation.'
      };
    } else if (normalizedValue >= 100) {
      return {
        level: 'prediabetes',
        title: 'Elevated (Possible Prediabetes)',
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        description: 'Your reading is higher than normal. Lifestyle changes can often help manage this.'
      };
    } else {
      return {
        level: 'normal',
        title: 'Normal Range',
        color: 'text-green-600 bg-green-50 border-green-200',
        description: 'Great news! Your fasting glucose levels appear to be within the healthy range.'
      };
    }
  } else {
    // Random test
    if (normalizedValue >= 200) {
      return {
        level: 'diabetes',
        title: 'High Range (Possible Diabetes)',
        color: 'text-red-600 bg-red-50 border-red-200',
        description: 'Your random glucose reading is quite high. We recommend seeing a doctor soon.'
      };
    } else if (normalizedValue >= 140) {
      return {
        level: 'prediabetes',
        title: 'Elevated (Possible Prediabetes)',
        color: 'text-orange-600 bg-orange-50 border-orange-200',
        description: 'Your levels are slightly elevated. Monitor your diet and exercise.'
      };
    } else {
      return {
        level: 'normal',
        title: 'Normal Range',
        color: 'text-green-600 bg-green-50 border-green-200',
        description: 'Your random glucose levels appear normal.'
      };
    }
  }
}
