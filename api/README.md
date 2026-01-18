# API Serverless Functions

This folder contains Vercel serverless functions that handle sensitive operations with the Gemini API.

## Structure

- `api/ai/chat.ts` - Chat endpoint for health-related questions
- `api/ai/analyze-image.ts` - Image analysis endpoint for glucometer reading

## Security

These serverless functions:
- Keep the Gemini API key on the server side
- Prevent API key exposure in client-side code
- Include rate limiting to prevent abuse
- Validate all inputs before processing

## Environment Variables

Required environment variables (set in Vercel dashboard or .env.local):

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## Endpoints

### POST /api/ai/chat
Handles health-related chat messages with context awareness.

**Request:**
```json
{
  "message": "What should I eat to lower blood sugar?",
  "context": {
    "glucoseValue": 180,
    "screeningId": 123
  }
}
```

**Response:**
```json
{
  "response": "To help lower blood sugar, focus on..."
}
```

### POST /api/ai/analyze-image
Analyzes glucometer images to extract glucose readings.

**Request:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response:**
```json
{
  "value": 107,
  "unit": "mg/dL"
}
```

## Rate Limiting

- Chat: 10 requests per minute per IP
- Image Analysis: 5 requests per minute per IP (more expensive operation)

## Local Development

For local testing with Vercel CLI:

```bash
npm install -g vercel
vercel dev
```

This will run the serverless functions locally at `http://localhost:3000/api/*`
