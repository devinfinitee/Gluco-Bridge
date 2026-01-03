import { useMutation } from "@tanstack/react-query";
import { api, type AnalyzeImageRequest, type ChatRequest } from "@shared/routes";

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
      const res = await fetch(api.ai.chat.path, {
        method: api.ai.chat.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const json = await res.json();
      return api.ai.chat.responses[200].parse(json);
    },
  });
}
