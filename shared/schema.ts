import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const screenings = pgTable("screenings", {
  id: serial("id").primaryKey(),
  ageRange: text("age_range").notNull(), // "18-44", "45-64", "65+"
  gender: text("gender").notNull(),
  familyHistory: text("family_history").default("no"), // "yes" or "no"
  highBp: text("high_bp").default("no"), // "yes" or "no"
  symptoms: jsonb("symptoms").$type<string[]>().default([]),
  glucoseValue: integer("glucose_value"),
  glucoseUnit: text("glucose_unit").default("mg/dL"), // "mg/dL" or "mmol/L"
  testType: text("test_type").default("random"), // "fasting" or "random"
  bmi: real("bmi"), // Body Mass Index
  bmiCategory: text("bmi_category"), // "underweight", "normal", "overweight", "obese", "severely-obese"
  weight: text("weight"), // weight value
  height: text("height"), // height value
  riskLevel: text("risk_level"), // "low", "moderate", "high"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScreeningSchema = createInsertSchema(screenings).omit({ 
  id: true, 
  createdAt: true 
});

export type Screening = typeof screenings.$inferSelect;
export type InsertScreening = z.infer<typeof insertScreeningSchema>;

// Types for AI interactions
export const analyzeImageSchema = z.object({
  image: z.string(), // Base64 string
});

export const chatSchema = z.object({
  message: z.string(),
  context: z.object({
    screeningId: z.number().optional(),
    glucoseValue: z.number().optional(),
  }).optional(),
});

export type AnalyzeImageRequest = z.infer<typeof analyzeImageSchema>;
export type ChatRequest = z.infer<typeof chatSchema>;
