import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { chatSchema } from '../../shared/schema';

// Rate limiting storage (in-memory for serverless)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000): boolean {
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

function isHealthRelatedQuery(message: string): boolean {
  const healthKeywords = [
    'glucose', 'blood sugar', 'diabetes', 'carb', 'sugar', 'insulin',
    'weight', 'exercise', 'nutrition', 'diet', 'meal', 'food', 'protein',
    'health', 'doctor', 'medicine', 'symptom', 'blood pressure', 'bp',
    'cholesterol', 'wellness', 'breakfast', 'lunch', 'dinner', 'snack',
    'walk', 'run', 'yoga', 'sleep', 'stress', 'monitor', 'test', 'reading',
    'fasting', 'postprandial', 'hypertension', 'obese', 'weight loss',
    'exercise routine', 'meal plan',
  ];

  const lowerMessage = message.toLowerCase();
  return healthKeywords.some((keyword) => lowerMessage.includes(keyword));
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
    // Rate limiting
    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0] || 
                     req.socket.remoteAddress || 
                     'unknown';
    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded. Please wait a moment before trying again.' 
      });
    }

    // Validate request body
    const validationResult = chatSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Invalid request', 
        errors: validationResult.error.errors 
      });
    }

    const { message, context } = validationResult.data;

    // Validate health-related query
    if (!isHealthRelatedQuery(message)) {
      return res.status(200).json({
        response: "I'm designed to help with health and wellness questions only. Please ask me something about glucose levels, diabetes, nutrition, exercise, or general health.",
      });
    }

    // Initialize Gemini API
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ 
        message: 'API configuration error. Please contact support.' 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build system prompt with context
    let systemPrompt = `You are a helpful health information assistant specializing in diabetes management and glucose monitoring.
- Provide evidence-based, practical health guidance
- Keep responses concise and accessible (2-3 sentences max)
- Always remind users to consult healthcare providers for medical advice
- Focus on glucose management, nutrition, exercise, and wellness`;

    // Add context if provided
    if (context?.glucoseValue) {
      const glucoseStatus = 
        context.glucoseValue > 200 ? 'High' : 
        context.glucoseValue < 70 ? 'Low' : 
        'Normal';
      
      systemPrompt += `\n\nCurrent User Context:\n- Glucose Level: ${context.glucoseValue} mg/dL (${glucoseStatus})`;
    }

    // Generate response
    const result = await model.generateContent([
      { text: systemPrompt },
      { text: message },
    ]);

    const response = result.response.text().trim();

    if (!response) {
      throw new Error('Empty response from AI model');
    }

    return res.status(200).json({ response });

  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      if (errorMsg.includes('api_key') || errorMsg.includes('unauthenticated')) {
        return res.status(500).json({ 
          message: 'API configuration error. Please contact support.' 
        });
      }
      
      if (errorMsg.includes('429') || errorMsg.includes('quota')) {
        return res.status(429).json({ 
          message: 'Service temporarily busy. Please try again in a moment.' 
        });
      }
    }
    
    return res.status(500).json({ 
      message: 'Failed to generate response. Please try again.' 
    });
  }
}
