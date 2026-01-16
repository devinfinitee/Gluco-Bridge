# Gemini API Functions - Quick Reference

## ✅ All Exported Functions

### 1️⃣ `scanGlucometer(base64Image: string): Promise<string>`

**Purpose**: Extract glucose value from monitor image  
**Returns**: `"120 mg/dL"` or `"6.7 mmol/L"`  
**Location**: [geminiAPI.ts L49](client/src/lib/geminiAPI.ts#L49)  
**Used In**: GlucoseEntry.tsx, Results.tsx

```typescript
const result = await scanGlucometer(imageBase64);
// Returns: "115 mg/dL"
```

---

### 2️⃣ `callGeminiAPI(prompt, historyOrImage?, context?): Promise<string>`

**Purpose**: Flexible chat & image analysis  
**Smart Parameters**:

- If `historyOrImage` is a string with `data:` or very long → treats as image
- If `historyOrImage` is an array → treats as chat history  
  **Location**: [geminiAPI.ts L236](client/src/lib/geminiAPI.ts#L236)  
  **Used In**: use-ai.ts, Results.tsx, GlucoseEntry.tsx

```typescript
// Chat usage:
const response = await callGeminiAPI("What should I eat?", chatHistory, {
  glucoseValue: 120,
  testType: "fasting",
});

// Image analysis usage:
const response = await callGeminiAPI("Extract glucose value", imageBase64);
```

---

### 3️⃣ `getHealthAdvice(userQuery: string): Promise<string>`

**Purpose**: Health-focused advice endpoint  
**Location**: [geminiAPI.ts L115](client/src/lib/geminiAPI.ts#L115)  
**Status**: Exported (internal use)

```typescript
const advice = await getHealthAdvice("How to manage high glucose?");
```

---

### 4️⃣ `isHealthRelatedQuery(message: string): boolean`

**Purpose**: Filter non-health conversations  
**Returns**: `true` if health-related, `false` otherwise  
**Location**: [geminiAPI.ts L144](client/src/lib/geminiAPI.ts#L144)  
**Used In**: use-ai.ts

```typescript
if (isHealthRelatedQuery("Tell me about diabetes")) {
  // Proceed with API call
}
```

**Tracked Keywords**: glucose, diabetes, nutrition, exercise, sleep, stress, symptoms, etc.

---

### 5️⃣ `formatConversationHistory(history: any[]): GeminiMessage[]`

**Purpose**: Convert chat history to API format  
**Location**: [geminiAPI.ts L162](client/src/lib/geminiAPI.ts#L162)  
**Used In**: use-ai.ts

```typescript
const formatted = formatConversationHistory([
  { role: "user", text: "Hello" },
  { role: "ai", content: "Hi there" },
]);
```

---

### 6️⃣ `generateSuggestedQuestions(glucoseValue, testType, riskLevel?): string[]`

**Purpose**: Generate contextual follow-up questions  
**Location**: [geminiAPI.ts L176](client/src/lib/geminiAPI.ts#L176)  
**Used In**: Results.tsx

```typescript
const suggestions = generateSuggestedQuestions(
  145, // glucose value
  "fasting", // test type
  "prediabetes", // risk level (optional)
);
// Returns: ["What causes high fasting glucose?", "How can I lower my fasting blood sugar?", ...]
```

**Logic**:

- High glucose (>140): Diet, exercise, warning signs
- Low glucose (<70): Treatment, quick carbs
- Fasting: Specific fasting management
- Risk-based: Prevention strategies

---

## 📋 Import Checklist

| File                                                     | Imports                                                              | Status |
| -------------------------------------------------------- | -------------------------------------------------------------------- | ------ |
| [use-ai.ts](client/src/hooks/use-ai.ts#L3)               | `callGeminiAPI`, `isHealthRelatedQuery`, `formatConversationHistory` | ✅     |
| [Results.tsx](client/src/pages/Results.tsx#L9)           | `generateSuggestedQuestions`, `callGeminiAPI`                        | ✅     |
| [GlucoseEntry.tsx](client/src/pages/GlucoseEntry.tsx#L7) | `callGeminiAPI`                                                      | ✅     |

---

## 🔧 Configuration

**Required**: Set in `.env.local`

```env
VITE_GEMINIKEY=your_api_key_here
```

**Auto-Validation**:

- ✅ Key existence check
- ✅ Key length validation
- ✅ Detailed error messages

---

## ⚠️ Error Handling

| Scenario           | Error Message                                      |
| ------------------ | -------------------------------------------------- |
| Missing API Key    | "API key not configured. Ensure VITE_GEMINIKEY..." |
| Invalid API Key    | "Authentication error. Check your API key."        |
| Rate Limited (429) | "Service temporarily busy. Try again."             |
| Quota Exceeded     | "API quota exceeded. Try again later."             |
| Image Unreadable   | "Unable to read monitor. Ensure image is clear."   |
| Empty Response     | "Empty response from model"                        |

---

## 🎯 Common Usage Patterns

### Pattern 1: Scan Glucometer Image

```typescript
try {
  const reading = await callGeminiAPI("Extract glucose value", base64ImageData);
  console.log(reading); // "120 mg/dL"
} catch (error) {
  toast.error(error.message);
}
```

### Pattern 2: Chat with Context

```typescript
const response = await callGeminiAPI(userMessage, conversationHistory, {
  glucoseValue: 150,
  testType: "random",
  riskLevel: "prediabetes",
});
```

### Pattern 3: Generate Suggestions

```typescript
const questions = generateSuggestedQuestions(
  data.glucoseValue,
  data.testType,
  interpretedRiskLevel,
);
// Use in UI: <button>{questions[0]}</button>
```

### Pattern 4: Validate Query

```typescript
if (isHealthRelatedQuery(userInput)) {
  const response = await callGeminiAPI(userInput);
} else {
  showWarning("Please ask a health-related question");
}
```

---

## 📊 Function Signature Reference

```typescript
// 1. Image OCR
scanGlucometer(base64Image: string): Promise<string>

// 2. Flexible Chat/Image
callGeminiAPI(
  userMessageOrPrompt: string,
  historyOrImage?: GeminiMessage[] | string,
  context?: {
    glucoseValue?: number;
    testType?: string;
    riskLevel?: string;
  }
): Promise<string>

// 3. Health Advice
getHealthAdvice(userQuery: string): Promise<string>

// 4. Query Validation
isHealthRelatedQuery(message: string): boolean

// 5. History Formatting
formatConversationHistory(history: any[]): GeminiMessage[]

// 6. Question Generation
generateSuggestedQuestions(
  glucoseValue: number,
  testType: 'fasting' | 'random' | 'postprandial',
  riskLevel?: 'normal' | 'prediabetes' | 'diabetes' | 'hypoglycemia'
): string[]
```

---

## 🚀 Latest Model (Jan 2026)

**Gemini 2.0 Flash** - Optimized for:

- Fast OCR processing (~1-2 seconds)
- Accurate text extraction
- Natural health conversations
- Cost-effective API calls
- Medical use case handling

---

**Last Updated**: January 16, 2026  
**Status**: ✅ Production Ready
