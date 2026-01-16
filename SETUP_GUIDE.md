# Configuration & Setup Guide

## Environment Variables

### Required (.env file)
```env
VITE_GEMINIKEY=your_google_gemini_api_key_here
```

Get your Gemini API key:
1. Visit: https://makersuite.google.com/app/apikey
2. Create a new API key
3. Copy and paste into .env
4. **Important**: This is exposed in browser - use a restricted key for production

## Installation & Running

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
Starts Vite dev server with hot reload

### Type Checking
```bash
npm run check
```
Validates TypeScript types

### Production Build
```bash
npm build
```
Creates optimized production bundle

### Preview Production Build
```bash
npm run preview
```
Tests production build locally

## Browser Requirements

### Minimum Requirements
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- Camera API support (getUserMedia)
- localStorage support

### Recommended
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- 512MB RAM minimum
- Stable internet connection

## Mobile Testing

### Testing on Mobile
1. **Local Network Testing**:
   ```bash
   npm run dev -- --host
   ```
   Access via your computer's IP: `http://192.168.x.x:5173`

2. **Camera Access**:
   - iOS: Settings → Safari → Camera → Allow
   - Android: Grant camera permission when prompted

3. **HTTPS Requirement** (for production):
   - Camera API requires HTTPS on production

## Key Libraries & Versions

### OCR & Image Processing
- `tesseract.js@7.0.0` - OCR recognition
- Canvas API - Image manipulation
- Native File API - Image reading

### AI Integration
- Google Generative AI API - Gemini models
- Latest endpoint: `generativelanguage.googleapis.com/v1beta1`

### UI & State Management
- React 18.3.1
- TailwindCSS 3.4.17
- Radix UI Components
- Framer Motion 11.18.2
- React Query 5.60.5

## API Configuration

### Gemini API
**Endpoint**: `https://generativelanguage.googleapis.com/v1beta1/models/gemini-1.5-flash:generateContent`

**Model**: `gemini-1.5-flash` (faster, suitable for real-time chat)

**Parameters**:
```typescript
{
  temperature: 0.7,          // Balanced creativity
  topK: 40,                  // Top-K sampling
  topP: 0.95,                // Nucleus sampling
  maxOutputTokens: 512       // Max response length
}
```

**Safety Settings**: All HARM_CATEGORY levels set to BLOCK_MEDIUM_AND_ABOVE

### System Prompt
The AI system is instructed to:
- Only answer health-related questions
- Provide educational guidance
- Always recommend consulting healthcare professionals
- Refuse non-health topics and medical diagnoses
- Use simple, accessible language

## Performance Optimization

### Image Processing
- Upscale factor: 2x (configurable in `fullPreprocessPipeline`)
- JPEG quality: 0.95 (high quality, smaller file)
- Canvas dimensions: Match video resolution

### OCR Processing
- Language: English (extendable to other languages)
- Confidence threshold: Logged but not hard-limited
- Processing happens client-side (no server needed)

### Chat & AI
- Temperature: 0.7 (balance between creativity and consistency)
- Max tokens: 512 (prevents overly long responses)
- Response time: ~2-5 seconds average

## Troubleshooting

### Camera Not Working
1. Check browser permissions (Settings → Privacy → Camera)
2. Ensure HTTPS on production (required by browsers)
3. Try different browser
4. Check device has working camera

### OCR Not Recognizing Values
1. Ensure good lighting
2. Position glucometer screen clearly in frame
3. Try image preprocessing with different settings
4. Check image isn't blurry

### Gemini API Errors
1. Verify API key is correct
2. Check API key has appropriate permissions
3. Ensure key isn't rate limited (429 error)
4. Check internet connectivity

### Build Errors
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Clear TypeScript cache: `npm run check`
4. Verify Node.js version (18+ recommended)

## Privacy & Data Handling

### What's Collected
- Glucose readings (stored in localStorage)
- Screening responses
- Chat history (in memory only, not persisted)
- Anonymized usage (if user consents)

### What's NOT Collected
- User identity (unless voluntarily provided)
- Location data
- Personal health records
- Medical history details

### Data Storage
- **Client-side**: localStorage for screening data
- **Server-side**: Optional backend integration
- **No third-party sharing**: Unless explicitly opted in

### Compliance
- GDPR ready (privacy consent implemented)
- HIPAA-compatible architecture
- No permanent health data collection by default

## Deployment Checklist

- [ ] Update VITE_GEMINIKEY in production environment
- [ ] Enable HTTPS (required for camera)
- [ ] Set up backend proxy for Gemini API calls
- [ ] Configure CORS headers
- [ ] Enable service workers for offline support (optional)
- [ ] Set up analytics (anonymized)
- [ ] Configure logging and error tracking
- [ ] Test on multiple devices/browsers
- [ ] Verify privacy policy is displayed
- [ ] Test camera on various devices
- [ ] Validate OCR accuracy
- [ ] Test chat responses

## Security Notes

### Current Implementation
- API key in browser (development only)
- No authentication system
- Data stored locally

### Production Recommendations
1. **Backend Proxy**: Route Gemini API through backend
2. **Authentication**: Implement user login if persisting data
3. **Encryption**: Use HTTPS and encrypt sensitive data
4. **Rate Limiting**: Implement on backend
5. **API Key Rotation**: Regular key rotation strategy
6. **Monitoring**: Track unusual API usage patterns
7. **Data Retention**: Implement data deletion policies

## Future Enhancements

### Short Term
- [ ] Backend integration for secure API calls
- [ ] User accounts and data persistence
- [ ] Multi-language support
- [ ] Offline mode with service workers

### Medium Term
- [ ] Wearable device integration
- [ ] Healthcare provider features
- [ ] Advanced analytics
- [ ] Data export functionality

### Long Term
- [ ] Mobile app (React Native)
- [ ] Smartwatch support
- [ ] Community features
- [ ] Clinical validation studies

## Support & Resources

- **Gemini API Documentation**: https://ai.google.dev/docs
- **Tesseract.js**: https://github.com/naptha/tesseract.js
- **React Documentation**: https://react.dev
- **TailwindCSS**: https://tailwindcss.com

## Contact & Issues

For issues or questions:
1. Check IMPLEMENTATION_SUMMARY.md
2. Review error messages in console
3. Test in different browser
4. Clear cache and rebuild

---

**Last Updated**: January 12, 2026
**Version**: 1.0.0
