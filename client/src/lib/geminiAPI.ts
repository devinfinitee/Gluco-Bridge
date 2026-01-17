/**
 * geminiAPI.ts - Rewritten Jan 2026
 * Uses Gemini 2.5 Flash with improved error handling and rate limiting
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import { visionLimiter, chatLimiter, formatRateLimitError } from "./rateLimiter";

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

let geminiClient: GoogleGenerativeAI | null = null;

/**
 * Initialize Gemini client with proper error handling
 */
function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const apiKey =
      (import.meta.env as any).VITE_GEMINIKEY || process.env.VITE_GEMINIKEY;

    if (!apiKey || apiKey.trim() === "") {
      console.error("API Key Status:", {
        exists: !!apiKey,
        length: apiKey?.length || 0,
        isValid: apiKey && apiKey.length > 10,
      });
      throw new Error(
        "Gemini API key not configured. Ensure VITE_GEMINIKEY is set in .env.local and the dev server has been restarted.",
      );
    }

    geminiClient = new GoogleGenerativeAI(apiKey.trim());
    console.log("✓ Gemini client initialized with Gemini 2.5 Flash");
  }
  return geminiClient;
}

/**
 * Scan and extract glucose value from monitor images
 * Uses Gemini 2.5 Flash model for OCR accuracy
 * Rate limited to prevent API quota exhaustion
 */
export async function scanGlucometer(base64Image: string): Promise<string> {
  // Check rate limit for vision API (expensive operation)
  const rateLimitStatus = visionLimiter.check('glucometer');
  
  if (rateLimitStatus.isLimited) {
    const errorMessage = formatRateLimitError(rateLimitStatus);
    throw new Error(errorMessage);
  }

  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

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

    const userPrompt =
      "Please read the glucose monitor display and provide the blood glucose value and unit.";

    // Clean base64 data
    const cleanBase64 = base64Image.includes(",")
      ? base64Image.split(",")[1]
      : base64Image;

    const response = await model.generateContent([
      {
        text: systemPrompt + "\n\n" + userPrompt,
      },
      {
        inlineData: {
          data: cleanBase64.trim().replace(/\s/g, ""),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const responseText = response.response.text().trim();

    if (!responseText) {
      throw new Error("Empty response from model");
    }

    return responseText;
  } catch (error) {
    console.error("Glucose scan error:", error);

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("rate limit") || errorMsg.includes("please wait")) {
        // Re-throw rate limit errors as-is
        throw error;
      }
      if (
        errorMsg.includes("api_key") ||
        errorMsg.includes("unauthenticated")
      ) {
        throw new Error(
          "API key is invalid or not configured. Please verify VITE_GEMINIKEY in .env.local and restart dev server.",
        );
      }
      if (errorMsg.includes("429")) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment and try again.",
        );
      }
      if (errorMsg.includes("bad request") || errorMsg.includes("invalid")) {
        throw new Error(
          "Invalid request - API key may be incorrect. Check your VITE_GEMINIKEY.",
        );
      }
      // Return actual error message
      throw new Error(`Unable to read monitor: ${error.message}`);
    }

    throw new Error(
      "Unable to read the monitor. Ensure the image is clear and try again.",
    );
  }
}

/**
 * Health advice endpoint with specialized system prompt
 */
export async function getHealthAdvice(userQuery: string): Promise<string> {
  try {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const systemPrompt = `You are a helpful health information assistant for diabetes management.
Provide practical, evidence-based guidance on glucose monitoring, diet, exercise, and wellness.
Always remind users to consult their healthcare provider for medical advice.
Keep responses concise and accessible.`;

    const response = await model.generateContent([
      { text: systemPrompt },
      { text: userQuery },
    ]);

    return response.response.text().trim();
  } catch (error) {
    console.error("Health advice error:", error);
    throw new Error("Unable to retrieve health information at this time.");
  }
}

/**
 * Check if a query is health-related
 * Used to filter and validate user messages
 */
export function isHealthRelatedQuery(message: string): boolean {
  const healthKeywords = [
    "glucose",
    "blood sugar",
    "diabetes",
    "carb",
    "sugar",
    "insulin",
    "weight",
    "exercise",
    "nutrition",
    "diet",
    "meal",
    "food",
    "protein",
    "health",
    "doctor",
    "medicine",
    "symptom",
    "blood pressure",
    "bp",
    "cholesterol",
    "wellness",
    "breakfast",
    "lunch",
    "dinner",
    "snack",
    "walk",
    "run",
    "yoga",
    "sleep",
    "stress",
    "monitor",
    "test",
    "reading",
    "fasting",
    "postprandial",
    "hypertension",
    "obese",
    "weight loss",
    "exercise routine",
    "meal plan",
  ];

  const lowerMessage = message.toLowerCase();
  return healthKeywords.some((keyword) => lowerMessage.includes(keyword));
}

/**
 * Format conversation history for Gemini API
 * Converts chat history to the format expected by the API
 */
export function formatConversationHistory(history: any[]): GeminiMessage[] {
  return history.map((msg) => {
    const role = msg.role === "user" ? "user" : "model";
    return {
      role,
      parts: [{ text: msg.text || msg.content || "" }],
    };
  });
}

/**
 * Generate suggested follow-up questions based on glucose context
 * Helps users ask relevant health questions
 */
export function generateSuggestedQuestions(
  glucoseValue: number,
  testType: "fasting" | "random" | "postprandial",
  riskLevel?: "normal" | "prediabetes" | "diabetes" | "hypoglycemia",
): string[] {
  const questions: string[] = [];

  // Determine glucose context
  const isHigh = glucoseValue > 140;
  const isLow = glucoseValue < 70;
  const isFasting = testType === "fasting";

  // Fasting-specific questions
  if (isFasting) {
    if (isHigh) {
      questions.push("What causes high fasting glucose levels?");
      questions.push("How can I lower my fasting blood sugar?");
      questions.push("Should I adjust my evening diet or medication?");
    }
  }

  // High glucose questions
  if (isHigh) {
    questions.push("What foods should I avoid?");
    questions.push("How much exercise do I need daily?");
    questions.push("Are there warning signs I should watch for?");
  }

  // Low glucose questions
  if (isLow) {
    questions.push("What should I do for low blood sugar?");
    questions.push("What are quick-acting carbs I can have?");
    questions.push("Why is my glucose dropping?");
  }

  // Risk-based questions
  if (riskLevel === "diabetes" || riskLevel === "prediabetes") {
    questions.push("Can I reverse prediabetes?");
    questions.push("What lifestyle changes matter most?");
  }

  if (riskLevel === "hypoglycemia") {
    questions.push("How do I prevent low blood sugar episodes?");
    questions.push("What's my action plan for hypoglycemia?");
  }

  // General fallback questions
  if (questions.length === 0) {
    questions.push("What should I eat next?");
    questions.push("How often should I test my glucose?");
    questions.push("What are normal glucose ranges?");
  }

  return questions.slice(0, 3); // Return top 3 suggestions
}

/**
 * Enhanced callGeminiAPI with context support and rate limiting
 * Overloaded function that accepts glucose context for better responses
 */
export async function callGeminiAPI(
  userMessageOrPrompt: string,
  historyOrImage?: GeminiMessage[] | string,
  context?: {
    glucoseValue?: number;
    testType?: string;
    riskLevel?: string;
  },
): Promise<string> {
  try {
    // Determine if historyOrImage is a history array or base64 image string
    const isImage =
      typeof historyOrImage === "string" &&
      (historyOrImage.includes("data:") ||
        historyOrImage.includes("/") ||
        historyOrImage.length > 500);

    // For image analysis, use vision limiter
    if (isImage) {
      const rateLimitStatus = visionLimiter.check('image-analysis');
      if (rateLimitStatus.isLimited) {
        throw new Error(formatRateLimitError(rateLimitStatus));
      }
    } else {
      // For chat, use chat limiter
      const rateLimitStatus = chatLimiter.check('chat');
      if (rateLimitStatus.isLimited) {
        throw new Error(formatRateLimitError(rateLimitStatus));
      }
    }

    const client = getGeminiClient();
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    // Case 1: Image analysis (glucometer scanning)
    if (isImage) {
      const cleanBase64 = historyOrImage.includes(",")
        ? historyOrImage.split(",")[1]
        : historyOrImage;

      const response = await model.generateContent([
        { text: userMessageOrPrompt },
        {
          inlineData: {
            data: cleanBase64.trim().replace(/\s/g, ""),
            mimeType: "image/jpeg",
          },
        },
      ]);

      return response.response.text().trim();
    }

    // Case 2: Chat with history and optional context
    const history = Array.isArray(historyOrImage) ? historyOrImage : [];

    let systemPrompt = `You are a helpful health information assistant specializing in diabetes management and glucose monitoring.
- Provide evidence-based, practical health guidance
- Keep responses concise and accessible (2-3 sentences max)
- Always remind users to consult healthcare providers for medical advice
- Focus on glucose management, nutrition, exercise, and wellness`;

    // Add context if provided
    if (context?.glucoseValue) {
      systemPrompt += `\n\nCurrent User Context:\n- Glucose Level: ${context.glucoseValue} ${context.glucoseValue > 200 ? "mg/dL (High)" : context.glucoseValue < 70 ? "mg/dL (Low)" : "mg/dL (Normal)"}`;
      if (context.testType)
        systemPrompt += `\n- Test Type: ${context.testType}`;
      if (context.riskLevel)
        systemPrompt += `\n- Risk Level: ${context.riskLevel}`;
    }

    const formattedHistory = history.filter(
      (msg) => msg.parts && msg.parts.length > 0,
    );

    const chat = model.startChat({
      history: formattedHistory.length > 0 ? formattedHistory : undefined,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage([
      { text: systemPrompt },
      { text: userMessageOrPrompt },
    ]);

    const text = result.response.text().trim();

    if (!text) {
      throw new Error("Empty response from chat model");
    }

    return text;
  } catch (error) {
    console.error("API call error:", error);

    if (error instanceof Error) {
      const errorMsg = error.message.toLowerCase();
      
      // Rate limit errors - pass through as-is
      if (errorMsg.includes("rate limit") || errorMsg.includes("please wait")) {
        throw error;
      }
      
      if (
        errorMsg.includes("unauthenticated") ||
        errorMsg.includes("api_key")
      ) {
        throw new Error(
          "API Key Error: Please verify VITE_GEMINIKEY is set correctly in .env.local and restart dev server.",
        );
      }
      if (errorMsg.includes("429")) {
        throw new Error(
          "Service temporarily busy. Please try again in a moment.",
        );
      }
      if (errorMsg.includes("resource_exhausted")) {
        throw new Error("API quota exceeded. Please try again later.");
      }
      if (errorMsg.includes("bad request") || errorMsg.includes("invalid")) {
        throw new Error("Invalid request. Check your API key.");
      }
      // Pass through the actual error for debugging
      throw new Error(`Chat failed: ${error.message}`);
    }

    throw new Error("Unable to process your request. Please try again later.");
  }
}
