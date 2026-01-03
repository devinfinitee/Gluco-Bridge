import { z } from 'zod';
import { insertScreeningSchema, screenings, analyzeImageSchema, chatSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  screenings: {
    create: {
      method: 'POST' as const,
      path: '/api/screenings',
      input: insertScreeningSchema,
      responses: {
        201: z.custom<typeof screenings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/screenings/:id',
      responses: {
        200: z.custom<typeof screenings.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  ai: {
    analyzeImage: {
      method: 'POST' as const,
      path: '/api/ai/analyze-image',
      input: analyzeImageSchema,
      responses: {
        200: z.object({ value: z.number().nullable(), unit: z.string().nullable() }),
        500: errorSchemas.internal,
      },
    },
    chat: {
      method: 'POST' as const,
      path: '/api/ai/chat',
      input: chatSchema,
      responses: {
        200: z.object({ response: z.string() }),
        500: errorSchemas.internal,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
