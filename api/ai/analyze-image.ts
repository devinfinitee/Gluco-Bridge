import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

// Inline schema validation
const analyzeImageSchema = z.object({
  image: z.string(),
});

// Rate limiting storage (in-memory for serverless)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

function parseGlucoseValue(responseText: string): { value: number | null; unit: string | null } {
  const text = responseText.toUpperCase().trim();

  // Handle UNREADABLE response
  if (text.includes('UNREADABLE') || text.includes('CANNOT READ')) {
    return { value: null, unit: null };
  }

  // Try to extract value and unit
  const patterns = [
    // mg/dL patterns
    /(\d+(?:\.\d+)?)\s*(?:mg|MG)[\s\/]*(?:dL|DL)/i,
    // mmol/L patterns
    /(\d+(?:\.\d+)?)\s*(?:mmol|MMOL)[\s\/]*(?:L|l)/i,
    // Generic number with unit mention
    /(\d+(?:\.\d+)?)\s*(?:mg\/dL|mmol\/L)/i,
    // Just a number (assume mg/dL)
    /\b(\d+(?:\.\d{1,2})?)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      
      // Validate glucose range (20-600 is reasonable)
      if (value >= 20 && value <= 600) {
        let unit = 'mg/dL'; // default
        if (text.includes('MMOL') || text.includes('MMOL/L')) {
          unit = 'mmol/L';
        }
        
        return { value, unit };
      }
    }
  }

  return { value: null, unit: null };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Rate limiting (stricter for image analysis - more expensive)
    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || 
                     req.socket.remoteAddress || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded. Please wait before scanning another image.' 
      });
    }

    // Validate request body
    const validationResult = analyzeImageSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Invalid request', 
        errors: validationResult.error.errors 
      });
    }

    const { image } = validationResult.data;

    // Validate image data
    if (!image || image.length < 100) {
      return res.status(400).json({ 
        message: 'Invalid or empty image data' 
      });
    }

    console.log('Image data length:', image.length);
    console.log('Image starts with:', image.substring(0, 100));

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        message: 'API configuration error. Please contact support.' 
      });
    }

    // Validate API key format (should be long alphanumeric string)
    if (apiKey.length < 30) {
      console.error('API key appears to be invalid (too short)');
      return res.status(500).json({ 
        message: 'Invalid API key configuration.' 
      });
    }

    console.log('API key configured:', `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 10)}`);
    
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are a medical imaging specialist expert in reading glucose monitoring devices.
Your task is to accurately extract the blood glucose reading from the provided image.

Instructions:
1. Identify the numerical glucose value displayed on the device (e.g., 107, 5.6, 180)
2. Identify the unit of measurement shown on the device
3. Return ONLY the value and unit in this EXACT format: "VALUE UNIT"
   - For mg/dL units, respond like: "107 mg/dL" or "180 mg/dL"
   - For mmol/L units, respond like: "5.6 mmol/L" or "8.2 mmol/L"
4. If the unit is not visible, assume mg/dL (most common in US devices)
5. If you cannot read the value clearly, respond with "UNREADABLE"
6. Do not include brackets, quotes, or any other text`;

    const userPrompt = 'Please read the glucose monitor display and provide the blood glucose value and unit.';

    // Clean base64 data
    const cleanBase64 = image.includes(',') ? image.split(',')[1] : image;
    
    console.log('Clean base64 length:', cleanBase64.length);

    // Generate response from Gemini
    try {
      console.log('Sending request to Gemini API...');
      
      const result = await ai.models.generateContent({
        model: 'models/gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemPrompt + '\n\n' + userPrompt },
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64.trim().replace(/\s/g, ''),
                },
              },
            ],
          },
        ],
      });

      const responseText = result.text.trim();

      if (!responseText) {
        throw new Error('Empty response from AI model');
      }

      console.log('Gemini response:', responseText);
      
      // Parse the glucose value from response
      const glucoseData = parseGlucoseValue(responseText);

      return res.status(200).json(glucoseData);
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError);
      throw apiError;
    }

  } catch (error) {
    console.error('Image analysis API error:', error);
    
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Full error details:', {
      message: errorMsg,
      type: error instanceof Error ? error.constructor.name : typeof error,
      stack: error instanceof Error ? error.stack : 'no stack',
      errorObj: error
    });
    
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      
      // Check for API key issues
      if (msg.includes('api_key') || msg.includes('unauthenticated') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
        console.error('API Key error detected');
        return res.status(500).json({ 
          message: 'API configuration error. Verify your API key is valid and has the required permissions.' 
        });
      }
      
      // Check for quota/rate limit issues
      if (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted') || msg.includes('quota exceeded')) {
        return res.status(429).json({ 
          message: 'API quota exceeded. Please try again later.' 
        });
      }
      
      // Check for invalid request issues
      if (msg.includes('invalid') || msg.includes('bad request') || msg.includes('malformed')) {
        return res.status(400).json({ 
          message: 'Invalid image data or request format.' 
        });
      }

      // Check for network/connection issues
      if (msg.includes('econnrefused') || msg.includes('enotfound') || msg.includes('timeout') || msg.includes('fetch')) {
        console.error('Network error connecting to Google API');
        return res.status(503).json({ 
          message: 'Unable to connect to AI service. Please try again later.' 
        });
      }
    }
    
    return res.status(500).json({ 
      message: 'Failed to analyze image. Please try again.' 
    });
  }
}
