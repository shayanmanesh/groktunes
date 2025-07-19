# GrokTunes.ai Deployment Guide

## Prerequisites
- Cloudflare account
- Node.js 18+ installed
- npm or yarn package manager

## Step 1: Deploy Cloudflare Workers API

1. **Install Wrangler CLI**:
```bash
npm install -g wrangler
```

2. **Login to Cloudflare**:
```bash
wrangler login
```

3. **Deploy the Workers**:
```bash
cd workers
npm install
wrangler deploy
```

4. **Note your Workers URL** (e.g., `https://groktunes-api.YOUR-SUBDOMAIN.workers.dev`)

## Step 2: Enable Cloudflare AI

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → Select your `groktunes-api` worker
3. Go to **Settings** → **Bindings**
4. Click **Add binding**:
   - Type: **Workers AI**
   - Variable name: `AI`
   - Click **Save**

## Step 3: Update Frontend Configuration

1. **Create `.env` file** in the root directory:
```bash
cp .env.example .env
```

2. **Edit `.env`** and update with your Workers URL:
```
VITE_API_URL=https://groktunes-api.YOUR-SUBDOMAIN.workers.dev
```

## Step 4: Deploy Frontend to Cloudflare Pages

### Option A: Via Dashboard
1. Go to **Workers & Pages** → **Create application** → **Pages**
2. Connect your GitHub repository
3. Set build configuration:
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `VITE_API_URL` = your Workers URL

### Option B: Via CLI
```bash
npm install -g wrangler
wrangler pages deploy dist --project-name groktunes
```

## Step 5: Test the Deployment

1. **Test API Health**:
```bash
curl https://groktunes-api.YOUR-SUBDOMAIN.workers.dev/api/health
```

2. **Test the Frontend**:
   - Open your Cloudflare Pages URL
   - Try recording audio
   - Check browser console for any errors

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure the Workers API includes proper headers:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Audio Format Issues
- Whisper expects base64 encoded audio
- Supported formats: webm, mp3, wav, m4a
- Maximum file size: 25MB

### AI Model Errors
- Ensure AI binding is properly configured
- Check Cloudflare dashboard for AI usage limits
- Some models may require paid plans

## Model-Specific Notes

### Whisper (Audio Transcription)
- Model: `@cf/openai/whisper-large-v3-turbo`
- Input: Base64 encoded audio
- Supports multiple languages

### QwQ-32b (Music Analysis)
- Model: `@cf/qwen/qwq-32b-preview`
- Good for reasoning and analysis
- Temperature: 0.7 for creative responses

### FLUX (Visual Generation)
- Model: `@cf/black-forest-labs/flux-1-schnell`
- Fast image generation (4 steps)
- Returns binary image data

### MeloTTS (Audio Generation)
- Currently returns mock data
- Real implementation requires additional setup
- Consider using external TTS APIs

## Production Checklist

- [ ] Update all API URLs to production
- [ ] Enable rate limiting on Workers
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure custom domain
- [ ] Enable caching for static assets
- [ ] Set up analytics
- [ ] Test on multiple devices/browsers
- [ ] Implement proper error handling
- [ ] Add loading states for all AI operations