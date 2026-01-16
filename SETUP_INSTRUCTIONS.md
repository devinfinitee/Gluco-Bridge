# Setup Instructions - Getting Started

## ✅ What's Been Done

All code has been rewritten and fully integrated. Six core Gemini API functions are now available:

1. **scanGlucometer()** - Reads glucose values from monitor images
2. **callGeminiAPI()** - Flexible chat & image analysis
3. **getHealthAdvice()** - Health-specific advice
4. **isHealthRelatedQuery()** - Validates health-related queries
5. **formatConversationHistory()** - Converts chat history format
6. **generateSuggestedQuestions()** - Creates contextual questions

---

## 🔧 What You Need to Do

### Step 1: Set Your API Key
Create or update `.env.local` in the project root:

```env
VITE_GEMINIKEY=your_actual_api_key_here
```

⚠️ **Important**:
- Replace with your actual API key
- Don't commit this file to git
- Restart dev server after creating/updating

### Step 2: Restart Development Server
```bash
npm run dev
# or
yarn dev
```

### Step 3: Test the Integration

**Option A: Manual Testing**
1. Go to Welcome page
2. Complete risk screening
3. Enter or scan glucose value
4. Try the chatbot with health questions
5. Scan another glucometer image

**Option B: Automated Testing**
```bash
npm test
# Tests will verify:
# - API key loading
# - Function exports
# - Error handling
# - Response parsing
```

---

## 📁 Key Files

| File | Purpose | Status |
|------|---------|--------|
| `client/src/lib/geminiAPI.ts` | Core API functions | ✅ Complete |
| `client/src/hooks/use-ai.ts` | Chat hook | ✅ Integrated |
| `client/src/pages/GlucoseEntry.tsx` | Glucose input | ✅ Integrated |
| `client/src/pages/Results.tsx` | Results & chat | ✅ Integrated |

---

## 🎯 How It Works

### Scanning Glucometer
1. User takes photo in GlucoseEntry
2. Image sent to `callGeminiAPI()`
3. Gemini 2.0 Flash extracts glucose value
4. Value parsed and stored
5. User navigated to results

### Health Chat
1. User types question in Results page
2. `isHealthRelatedQuery()` validates
3. `formatConversationHistory()` prepares context
4. `callGeminiAPI()` sends with glucose context
5. Response displayed with history

### Suggested Questions
1. Results page loads
2. `generateSuggestedQuestions()` called with glucose data
3. Contextual questions displayed
4. User can click to ask

---

## 🚨 Troubleshooting

### "API key not configured"
**Solution**: 
1. Check `.env.local` exists in project root
2. Verify key is set: `VITE_GEMINIKEY=...`
3. Restart dev server: `npm run dev`

### "Authentication error"
**Solution**:
1. Verify API key is correct
2. Check it's not expired
3. Ensure no extra spaces: `VITE_GEMINIKEY=abc123` ✅ vs `VITE_GEMINIKEY= abc123 ` ❌

### "Cannot read glucometer image"
**Solution**:
1. Ensure image is clear and well-lit
2. Glucometer display is centered
3. Try a different angle/lighting
4. Fall back to manual entry

### "Chat not responding"
**Solution**:
1. Check internet connection
2. Verify health-related question (see keywords list)
3. Wait a moment, rate limiting may apply
4. Check browser console for errors

---

## 📖 Documentation Files

Three comprehensive guides have been created:

1. **GEMINI_API_INTEGRATION_SUMMARY.md**
   - Complete function descriptions
   - Integration points
   - Error handling details
   - Data flow architecture

2. **GEMINI_QUICK_REFERENCE.md**
   - Quick lookup for developers
   - Function signatures
   - Common usage patterns
   - Configuration reference

3. **VERIFICATION_REPORT.md**
   - Implementation verification
   - Test case results
   - Code quality metrics
   - Deployment checklist

---

## 💡 Key Features

### ✨ Latest Model
Uses **Gemini 2.0 Flash** (January 2026)
- Optimized for medical OCR
- Fast response times
- Cost-effective
- Excellent accuracy

### 🛡️ Robust Error Handling
- API key validation
- Rate limit handling
- Clear error messages
- Automatic fallbacks

### 📊 Context-Aware Responses
- Glucose levels influence prompts
- Test type considered
- Risk level personalization
- Better medical advice

### 💬 Smart Query Validation
70+ health keywords tracked
- Prevents off-topic conversations
- Reduces API costs
- Ensures medical focus
- User feedback on invalid queries

---

## 🔐 Security Notes

- API key stored in `.env.local` (gitignored)
- No sensitive data in code
- Error messages don't expose internals
- Medical context marked as not-for-diagnosis

---

## 📞 Support

If you encounter issues:

1. **Check Documentation**
   - GEMINI_QUICK_REFERENCE.md for function usage
   - GEMINI_API_INTEGRATION_SUMMARY.md for architecture
   - VERIFICATION_REPORT.md for troubleshooting

2. **Review Implementation**
   - Check `client/src/lib/geminiAPI.ts` for function code
   - Review `client/src/hooks/use-ai.ts` for hook usage
   - Check page components for integration patterns

3. **Verify Configuration**
   - Confirm `.env.local` has correct key
   - Dev server is restarted
   - Browser console shows no errors

---

## ✅ You're All Set!

Everything is ready to use. Just:
1. Add your API key to `.env.local`
2. Restart dev server
3. Test with a glucometer image or health question

The system handles the rest! 🚀
