import { useMutation } from "@tanstack/react-query";
import { scanGlucometer, callGeminiAPI, isHealthRelatedQuery } from "@/lib/geminiAPI";

/**
 * Hook for analyzing glucometer images.
 * Tries the server-side Vercel API first, falls back to client-side Gemini.
 */
export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async (data: { image: string }) => {
      // Try server-side API first (Vercel Functions)
      try {
        const res = await fetch('/api/ai/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const json = await res.json();
          return json as { value: number | null; unit: string | null };
        }
        // If server returns error, fall through to client-side
        console.warn('Server API returned error, falling back to client-side Gemini');
      } catch (err) {
        console.warn('Server API unavailable, using client-side Gemini:', err);
      }

      // Fallback: client-side Gemini Vision
      const responseText = await scanGlucometer(data.image);

      // Parse the response text into value/unit
      const parsed = parseGlucoseResponse(responseText);
      return parsed;
    },
  });
}

/**
 * Hook for AI health chat.
 * Tries the server-side Vercel API first, falls back to client-side Gemini.
 */
export function useChat() {
  return useMutation({
    mutationFn: async (data: { message: string; context?: { glucoseValue?: number; screeningId?: number } }) => {
      // Try server-side API first
      try {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const json = await res.json();
          return json as { response: string };
        }

        // If the server returns 200 with a non-health message, still return it
        if (res.status === 200) {
          const json = await res.json();
          return json as { response: string };
        }

        console.warn('Server chat API returned error, falling back to client-side');
      } catch (err) {
        console.warn('Server chat API unavailable, using client-side Gemini:', err);
      }

      // Fallback: client-side Gemini chat
      // Check if health-related on client side
      if (!isHealthRelatedQuery(data.message)) {
        return {
          response: "I'm designed to help with health and wellness questions only. Please ask me something about glucose levels, diabetes, nutrition, exercise, or general health."
        };
      }

      const response = await callGeminiAPI(
        data.message,
        [], // no history for now
        data.context ? { glucoseValue: data.context.glucoseValue } : undefined
      );

      return { response };
    },
  });
}

/**
 * Parse Gemini vision response text into glucose value/unit
 */
function parseGlucoseResponse(responseText: string): { value: number | null; unit: string | null } {
  const text = responseText.toUpperCase().trim();

  if (text.includes('UNREADABLE') || text.includes('CANNOT READ')) {
    return { value: null, unit: null };
  }

  const patterns = [
    /(\d+(?:\.\d+)?)\s*(?:mg|MG)[\s\/]*(?:dL|DL)/i,
    /(\d+(?:\.\d+)?)\s*(?:mmol|MMOL)[\s\/]*(?:L|l)/i,
    /(\d+(?:\.\d+)?)\s*(?:mg\/dL|mmol\/L)/i,
    /\b(\d+(?:\.\d{1,2})?)\b/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const value = parseFloat(match[1]);
      if (value >= 20 && value <= 600) {
        let unit = 'mg/dL';
        if (text.includes('MMOL') || text.includes('MMOL/L')) {
          unit = 'mmol/L';
        }
        return { value, unit };
      }
    }
  }

  return { value: null, unit: null };
}
