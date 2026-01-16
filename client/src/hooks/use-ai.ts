import { useMutation } from "@tanstack/react-query";
import { api, type AnalyzeImageRequest, type ChatRequest } from "@shared/routes";
import { callGeminiAPI, isHealthRelatedQuery, formatConversationHistory } from "@/lib/geminiAPI";

export function useAnalyzeImage() {
  return useMutation({
    mutationFn: async (data: AnalyzeImageRequest) => {
      const res = await fetch(api.ai.analyzeImage.path, {
        method: api.ai.analyzeImage.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze image');
      }

      const json = await res.json();
      return api.ai.analyzeImage.responses[200].parse(json);
    },
  });
}

export function useChat() {
  return useMutation({
    mutationFn: async (data: ChatRequest) => {
      // Validate that the question is health-related
      if (!isHealthRelatedQuery(data.message)) {
        return {
          response: "I'm designed to help with health and wellness questions only. Please ask me something about glucose levels, diabetes, nutrition, exercise, or general health.",
        };
      }

      try {
        // Convert conversation history format if available
        const conversationHistory = (data as any).conversationHistory
          ? formatConversationHistory((data as any).conversationHistory)
          : [];

        // Call Gemini API with health context
        const response = await callGeminiAPI(
          data.message,
          conversationHistory,
          {
            glucoseValue: data.context?.glucoseValue,
            testType: (data.context as any)?.testType,
            riskLevel: (data.context as any)?.riskLevel,
          }
        );

        return { response };
      } catch (error) {
        console.error('Chat error:', error);
        
        if (error instanceof Error) {
          if (error.message.includes('API key')) {
            throw new Error('API configuration error. Please contact support.');
          } else if (error.message.includes('health-related')) {
            throw new Error('Please ask a health-related question.');
          }
        }
        
        throw new Error('Failed to get response. Please try again.');
      }
    },
  });
}
