/**
 * Glucose validation utility
 * Ensures valid glucose readings with proper ranges
 * Updated for commercial use with extended ranges
 */

export interface GlucoseValidationResult {
  isValid: boolean;
  value: number | null;
  error?: string;
  warning?: string; // Non-blocking warnings for extreme but valid readings
}

export interface BMIResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese' | 'severely-obese';
  categoryDisplay: string;
  color: string;
  description: string;
}

/**
 * Validate glucose reading with commercial-grade ranges
 * @param value - The glucose value to validate
 * @param unit - Unit of measurement (mg/dL or mmol/L)
 * @returns Validation result with error message if invalid, warning if extreme
 */
export function validateGlucose(value: string | number, unit: 'mg/dL' | 'mmol/L'): GlucoseValidationResult {
  // Check if value is empty
  if (value === '' || value === null || value === undefined) {
    return {
      isValid: false,
      value: null,
      error: 'Please enter a glucose value'
    };
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  // Check if value is a valid number
  if (isNaN(numValue)) {
    return {
      isValid: false,
      value: null,
      error: 'Please enter a valid number'
    };
  }

  // Check if value is negative or zero
  if (numValue <= 0) {
    return {
      isValid: false,
      value: null,
      error: 'Glucose value must be greater than 0'
    };
  }

  // Validate based on unit - Commercial ranges
  if (unit === 'mg/dL') {
    // Hard limits: 10-800 mg/dL (covers extreme medical cases)
    // Warning range: <20 or >600 mg/dL (critical values)
    // Normal acceptance: 20-600 mg/dL
    
    if (numValue < 10) {
      return {
        isValid: false,
        value: null,
        error: 'Value too low (below 10 mg/dL). Please verify your glucometer reading.'
      };
    }
    if (numValue > 800) {
      return {
        isValid: false,
        value: null,
        error: 'Value too high (above 800 mg/dL). Please verify your glucometer reading.'
      };
    }
    
    // Warning for extreme but valid values
    if (numValue < 20) {
      return {
        isValid: true,
        value: numValue,
        warning: 'This is an extremely low reading. If accurate, seek immediate medical attention.'
      };
    }
    if (numValue > 600) {
      return {
        isValid: true,
        value: numValue,
        warning: 'This is an extremely high reading. If accurate, seek immediate medical attention.'
      };
    }
  } else {
    // mmol/L range: 0.6-44.4 mmol/L (commercial limits)
    // Warning range: <1.1 or >33.3 mmol/L (critical values)
    // Normal acceptance: 1.1-33.3 mmol/L
    
    if (numValue < 0.6) {
      return {
        isValid: false,
        value: null,
        error: 'Value too low (below 0.6 mmol/L). Please verify your glucometer reading.'
      };
    }
    if (numValue > 44.4) {
      return {
        isValid: false,
        value: null,
        error: 'Value too high (above 44.4 mmol/L). Please verify your glucometer reading.'
      };
    }
    
    // Warning for extreme but valid values
    if (numValue < 1.1) {
      return {
        isValid: true,
        value: numValue,
        warning: 'This is an extremely low reading. If accurate, seek immediate medical attention.'
      };
    }
    if (numValue > 33.3) {
      return {
        isValid: true,
        value: numValue,
        warning: 'This is an extremely high reading. If accurate, seek immediate medical attention.'
      };
    }
  }

  return {
    isValid: true,
    value: numValue
  };
}

/**
 * Calculate BMI and categorize
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @returns BMI result with category and description
 */
export function calculateBMI(weight: number, height: number): BMIResult {
  // Validate inputs
  if (weight <= 0 || height <= 0) {
    throw new Error('Weight and height must be greater than 0');
  }

  if (height > 272) {
    // Tallest person ever recorded
    throw new Error('Height seems unrealistic. Please check your input.');
  }

  if (weight > 635) {
    // Heaviest documented person
    throw new Error('Weight seems unrealistic. Please check your input.');
  }

  // Convert height from cm to meters
  const heightMeters = height / 100;

  // Calculate BMI: weight (kg) / height (m)²
  const bmi = parseFloat((weight / (heightMeters * heightMeters)).toFixed(1));

  let category: 'underweight' | 'normal' | 'overweight' | 'obese' | 'severely-obese';
  let categoryDisplay: string;
  let color: string;
  let description: string;

  if (bmi < 18.5) {
    category = 'underweight';
    categoryDisplay = 'Underweight';
    color = 'text-blue-600 bg-blue-50 border-blue-200';
    description = 'You may need to gain weight. Consult a healthcare provider for personalized advice.';
  } else if (bmi < 25) {
    category = 'normal';
    categoryDisplay = 'Normal Weight';
    color = 'text-green-600 bg-green-50 border-green-200';
    description = 'Great! You maintain a healthy weight. Keep up with exercise and balanced diet.';
  } else if (bmi < 30) {
    category = 'overweight';
    categoryDisplay = 'Overweight';
    color = 'text-orange-600 bg-orange-50 border-orange-200';
    description = 'Consider lifestyle modifications including regular exercise and dietary changes.';
  } else if (bmi < 35) {
    category = 'obese';
    categoryDisplay = 'Obese (Class I)';
    color = 'text-red-600 bg-red-50 border-red-200';
    description = 'Please consult a healthcare provider for a weight management plan.';
  } else {
    category = 'severely-obese';
    categoryDisplay = 'Severely Obese (Class II+)';
    color = 'text-red-700 bg-red-50 border-red-300';
    description = 'It is important to consult with a healthcare provider immediately.';
  }

  return {
    bmi,
    category,
    categoryDisplay,
    color,
    description
  };
}

/**
 * Validate BMI input values
 */
export function validateBMIInputs(weight: string | number, height: string | number): {
  isValid: boolean;
  error?: string;
  weight?: number;
  height?: number;
} {
  const weightNum = typeof weight === 'string' ? parseFloat(weight) : weight;
  const heightNum = typeof height === 'string' ? parseFloat(height) : height;

  if (!weight || !height) {
    return {
      isValid: false,
      error: 'Please enter both weight and height'
    };
  }

  if (isNaN(weightNum) || isNaN(heightNum)) {
    return {
      isValid: false,
      error: 'Please enter valid numbers'
    };
  }

  if (weightNum <= 0 || heightNum <= 0) {
    return {
      isValid: false,
      error: 'Weight and height must be greater than 0'
    };
  }

  if (weightNum > 200 || heightNum > 250) {
    return {
      isValid: false,
      error: 'Values seem unrealistic. Please check your inputs.'
    };
  }

  if (heightNum < 50) {
    return {
      isValid: false,
      error: 'Height seems too low. Please enter height in centimeters.'
    };
  }

  return {
    isValid: true,
    weight: weightNum,
    height: heightNum
  };
}
