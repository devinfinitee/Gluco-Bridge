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
        const errorData = await res.json().catch(() => ({ message: 'Failed to analyze image' }));
        throw new Error(errorData.message || 'Failed to analyze image');
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
        const errorData = await res.json().catch(() => ({ message: 'Failed to get response' }));
        throw new Error(errorData.message || 'Failed to get response. Please try again.');
      }

      const json = await res.json();
      return api.ai.chat.responses[200].parse(json);
    },
  });
}
