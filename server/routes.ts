import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Initialize OpenAI client
  // Replit AI integration automatically sets AI_INTEGRATIONS_OPENAI_API_KEY
  const openai = new OpenAI({ 
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });

  // Screening routes
  app.post(api.screenings.create.path, async (req, res) => {
    try {
      const input = api.screenings.create.input.parse(req.body);
      const screening = await storage.createScreening(input);
      res.status(201).json(screening);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.get(api.screenings.get.path, async (req, res) => {
    const screening = await storage.getScreening(Number(req.params.id));
    if (!screening) {
      return res.status(404).json({ message: 'Screening not found' });
    }
    res.json(screening);
  });

  // AI Routes
  app.post(api.ai.analyzeImage.path, async (req, res) => {
    try {
      const { image } = api.ai.analyzeImage.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that extracts blood glucose readings from glucometer screens. Return ONLY a JSON object with 'value' (number) and 'unit' (string, either 'mg/dL' or 'mmol/L'). If unreadable, return null for both.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "What is the glucose reading in this image?" },
              {
                type: "image_url",
                image_url: {
                  url: image, // Base64 or URL
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" },
      });

      const content = response.choices[0].message.content;
      if (!content) throw new Error("No content from AI");
      
      const result = JSON.parse(content);
      res.json(result);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ message: "Failed to analyze image" });
    }
  });

  app.post(api.ai.chat.path, async (req, res) => {
    try {
      const { message, context } = api.ai.chat.input.parse(req.body);
      
      const systemPrompt = `You are GlucoBridge's educational AI assistant. 
      Your goal is to explain blood glucose concepts in simple, low-literacy friendly language.
      
      Context:
      - Screening ID: ${context?.screeningId || 'Not provided'}
      - Glucose Value: ${context?.glucoseValue || 'Not provided'}
      
      RULES:
      1. DO NOT diagnose diabetes or any condition.
      2. DO NOT prescribe medication.
      3. ALWAYS include "This is for educational purposes only."
      4. Keep answers short, encouraging, and easy to understand.
      5. Focus on lifestyle tips (walking, water, veggies) if asked for advice.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      });

      res.json({ response: response.choices[0].message.content || "I couldn't generate a response." });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ message: "Failed to generate response" });
    }
  });

  return httpServer;
}
