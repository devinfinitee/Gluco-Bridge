# 🚀 Quick Start - Secure Deployment

Your Gemini API key is now protected! Follow these steps to deploy:

## 1️⃣ Get a New API Key (IMPORTANT)

Since your old key was exposed, get a new one:

1. Visit https://makersuite.google.com/app/apikey
2. **Delete the old key** (the one that was leaked)
3. Click "Create API Key"
4. Copy the new key

## 2️⃣ Set Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** paste your new API key
   - **Environments:** Check all (Production, Preview, Development)
5. Click **Save**

## 3️⃣ Deploy to Vercel

```bash
# Make sure you're in the project directory
cd "c:\Users\victor ogunlade\Downloads\Device-Bridge\Gluco-Bridge"

# Install dependencies (if not done)
npm install

# Deploy to Vercel
npx vercel --prod
```

Follow the prompts:
- Link to existing project? **Yes**
- What's the project name? (confirm or enter)
- Deploy to production? **Yes**

## 4️⃣ Verify It's Working

After deployment completes:

1. Visit your deployed URL (e.g., `https://gluco-bridge.vercel.app`)
2. Test the **image scanning** feature
3. Test the **AI chat** feature
4. Check that no API key errors appear

## 5️⃣ Check Vercel Logs

In Vercel dashboard:
1. Go to your project
2. Click **"Deployments"** → Latest deployment
3. Click **"Functions"** tab
4. Check for any errors in the logs

---

## ✅ What's Protected Now

- ✅ API key never exposed to browser
- ✅ All AI features work through secure serverless functions
- ✅ Rate limiting prevents abuse
- ✅ Input validation on all requests

## 🎉 You're Done!

Your app is now secure. The API key is:
- Never sent to the client
- Only accessible server-side
- Protected by Vercel's infrastructure

---

## 📚 More Info

- **Full deployment guide:** See `DEPLOYMENT.md`
- **API documentation:** See `api/README.md`
- **Migration details:** See `API_SECURITY_MIGRATION.md`

## ❓ Troubleshooting

**Problem:** API calls fail with "configuration error"
**Solution:** Double-check the environment variable name is exactly `GEMINI_API_KEY` in Vercel

**Problem:** Functions timeout
**Solution:** Check Vercel function logs for details, may need to increase timeout in vercel.json

**Problem:** Rate limit errors
**Solution:** Normal behavior - wait 60 seconds. Means the rate limiting is working!

---

**Need help?** Check the documentation files mentioned above.
