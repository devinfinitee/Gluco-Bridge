import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  raw: any;
}

/**
 * Extract text from an image using Tesseract OCR
 */
export async function extractTextFromImage(imageData: string | Blob): Promise<OCRResult> {
  try {
    const result = await Tesseract.recognize(imageData, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    return {
      text: result.data.text,
      confidence: result.data.confidence,
      raw: result.data,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error(`Failed to extract text from image: ${error}`);
  }
}

/**
 * Extract glucose value from OCR text
 * Handles various formats like "120 mg/dL", "6.7 mmol/L", etc.
 */
export function extractGlucoseValue(
  text: string
): { value: number | null; unit: string | null } {
  // Normalize the text
  const normalized = text.toUpperCase().trim();

  // Try to find glucose value patterns
  const patterns = [
    // mg/dL patterns
    /(\d+(?:\.\d+)?)\s*(?:mg|MG)\/dL/,
    /(\d+(?:\.\d+)?)\s*mg\/dL/i,
    // mmol/L patterns
    /(\d+(?:\.\d+)?)\s*(?:mmol|MMOL)\/L/,
    /(\d+(?:\.\d+)?)\s*mmol\/l/i,
    // Generic number patterns (last resort)
    /\b(\d+(?:\.\d{1,2})?)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      
      // Validate glucose range (20-600 is reasonable range)
      if (value >= 20 && value <= 600) {
        // Detect unit
        let unit = 'mg/dL'; // default
        if (normalized.includes('MMOL') || normalized.includes('MMOL/L')) {
          unit = 'mmol/L';
        }
        
        return { value, unit };
      }
    }
  }

  return { value: null, unit: null };
}

/**
 * Analyze glucometer image and extract value
 */
export async function analyzeGlucometerImage(
  imageData: string
): Promise<{ value: number | null; unit: string | null }> {
  try {
    const ocrResult = await extractTextFromImage(imageData);
    const glucoseData = extractGlucoseValue(ocrResult.text);
    
    console.log('OCR Text:', ocrResult.text);
    console.log('Extracted Glucose:', glucoseData);
    
    return glucoseData;
  } catch (error) {
    console.error('Error analyzing glucometer image:', error);
    return { value: null, unit: null };
  }
}
