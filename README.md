# GrokTunes.ai - The AI Music Mind Reader

An AI-powered app that identifies songs from humming, provides musical analysis, creates remixes, and generates visual art.

## Features

- 🎤 **Audio Recording**: Hum, whistle, or describe tunes
- 🧠 **AI Identification**: Uses Whisper to transcribe and identify songs
- 📊 **Music Analysis**: Deep insights powered by QwQ-32b
- 🎵 **AI Remixes**: Generate different style versions with MeloTTS
- 🎨 **Visual Generation**: Create album art with FLUX
- 🎮 **Grok Battle**: Challenge friends to identify AI remixes

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Backend**: Cloudflare Workers
- **AI Models**:
  - Whisper-large-v3-turbo (Audio transcription)
  - QwQ-32b (Music analysis)
  - MeloTTS (Audio generation)
  - FLUX-1-schnell (Visual generation)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Cloudflare account (for Workers)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/groktunes.git
cd groktunes
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Install Workers dependencies:
```bash
cd workers
npm install
cd ..
```

### Development

1. Start the frontend development server:
```bash
npm run dev
```

2. In a separate terminal, start the Cloudflare Workers:
```bash
cd workers
npm run dev
```

3. Open http://localhost:5173 in your browser

### Deployment

#### Frontend
```bash
npm run build
# Deploy the dist folder to your hosting service
```

#### Cloudflare Workers
```bash
cd workers
npm run deploy
```

## Usage

1. Click "Start Recording" and hum/whistle your tune
2. Stop recording when done
3. The AI will identify the song and provide analysis
4. Explore different remix styles
5. Share your discoveries with friends

## API Endpoints

- `POST /api/transcribe` - Convert audio to text
- `POST /api/analyze` - Analyze music and provide insights
- `POST /api/generate-remix` - Create AI remixes
- `POST /api/generate-visual` - Generate album art
- `GET /api/health` - Health check

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License