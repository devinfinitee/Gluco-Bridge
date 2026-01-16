# Glucometer Image Capture Troubleshooting Checklist

## Quick Fixes (Try These First)

### ✅ Image Quality Checklist
- [ ] Image is in **focus** (not blurry)
- [ ] Image has **good lighting** (bright but not washed out)
- [ ] Glucometer **screen is fully visible** (no cropping)
- [ ] **No glare or reflections** on the screen
- [ ] Image is **not rotated** (screen is horizontal)
- [ ] **Numbers are clearly visible** and readable
- [ ] Image is not too **dark** or too **bright**

### ✅ Glucometer Model Checklist
- [ ] Using a **modern digital glucometer** (last 10 years)
- [ ] Display is **LCD** (not dot-matrix or old style)
- [ ] Numbers are **black or dark** on **light background**
- [ ] Display is **not curved** or distorted
- [ ] **Font is clear and readable** to the human eye

### ✅ Camera/Upload Process
- [ ] Using **Take Photo** button (not upload)
- [ ] Holding device **steady** while capturing
- [ ] **Waiting 2 seconds** before taking photo
- [ ] Allowing **proper focus time**
- [ ] **Not moving** while capturing

## If Still Not Working

### Debug Steps:

1. **Test With Printed Number**
   - Print "120 mg/dL" on a piece of paper
   - Take a photo of the printed text
   - If OCR fails, preprocessing may need adjustment

2. **Check Image Visibility**
   - After uploading, the image is processed
   - Check browser console (F12) for any errors
   - Look for "Preprocessing image..." and "Analyzing glucometer..." messages

3. **Try Manual Entry**
   - Switch to "Manual Entry" tab
   - Type the glucose value manually
   - This confirms app works end-to-end

4. **Check Gemini API**
   - VITE_GEMINIKEY should be set in `.env`
   - You mentioned it's already configured ✅
   - If chat fails, that's a separate issue

## Image Preprocessing Steps (What's Happening)

When you upload an image:

```
Original Image
        ↓
📏 Upscale 2x (make text larger)
        ↓
⚫ Grayscale (convert to B&W, remove color)
        ↓
🔆 Enhance Contrast (dark text, light background)
        ↓
🔪 Sharpen Edges (make text crisp)
        ↓
📖 Tesseract OCR (read the text)
        ↓
✨ Extract Glucose Value (find "120 mg/dL")
        ↓
✅ Display Result
```

## Why It Might Not Work

| Symptom | Cause | Solution |
|---|---|---|
| "Could not read..." error | Image too blurry | Take clearer photo with better focus |
| No error but no value | Text too small | Get closer to screen, or use upscaling |
| Detects wrong number | Reflection/glare | Move light source, clean screen |
| Detects "OXl" instead of "01" | Font confusion | Use glucometer with clearer fonts |
| Works sometimes, not others | Inconsistent lighting | Use consistent, bright lighting |

## Quick Reference: Good vs Bad Images

### ✅ GOOD Image (OCR will work)
- Clear, sharp focus
- Black numbers on white LCD screen
- Good lighting, no shadows
- Entire number visible
- Glucometer display held straight
- Taken from directly in front

### ❌ BAD Image (OCR will fail)
- Blurry or out of focus
- Too dark (underexposed)
- Too bright (overexposed/washed out)
- Number partially cropped
- Tilted at an angle
- Glare on screen
- Old/unusual glucometer display

## Real-World Testing

### Best Test Scenario:
1. Use a modern glucometer (OneTouch, Accu-Chek, etc.)
2. In a well-lit room (window light or lamp)
3. Hold camera 20-30cm from screen
4. Keep steady for 2 seconds
5. Take photo with screen in center of frame

### Minimal Viable Test:
1. Take photo of **printed "120"** on white paper
2. If OCR reads it, your setup is good
3. If not, adjust lighting/focus and retry
4. Then try with actual glucometer

## Still Having Issues?

### Escalation Steps:
1. **Check console errors** (F12 → Console tab)
2. **Try manual entry** to confirm app works
3. **Test with different glucometer** if available
4. **Improve image quality** (better lighting, focus)
5. **Use fallback method** (manual entry always works)

## Files Involved in OCR

- `client/src/lib/ocr.ts` - Tesseract OCR logic
- `client/src/lib/imagePreprocessing.ts` - Image enhancement
- `client/src/pages/GlucoseEntry.tsx` - Camera capture page
- `client/src/pages/Results.tsx` - Rescan option

---

**Remember**: Manual entry is always available as a fallback. OCR is a convenience feature, not a requirement. ✅
