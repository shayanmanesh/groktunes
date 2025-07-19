import { Env } from './types'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      // Route handling
      switch (url.pathname) {
        case '/api/transcribe':
          return handleTranscribe(request, env, corsHeaders)
        
        case '/api/analyze':
          return handleAnalyze(request, env, corsHeaders)
        
        case '/api/generate-remix':
          return handleGenerateRemix(request, env, corsHeaders)
        
        case '/api/generate-visual':
          return handleGenerateVisual(request, env, corsHeaders)
        
        case '/api/health':
          return new Response(JSON.stringify({ status: 'ok' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        
        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders })
      }
    } catch (error) {
      console.error('Error:', error)
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}

async function handleTranscribe(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'No audio file provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Convert audio file to array buffer
    const audioBuffer = await audioFile.arrayBuffer()
    
    // Use Whisper model to transcribe
    const response = await env.AI.run('@cf/openai/whisper-large-v3-turbo', {
      audio: [...new Uint8Array(audioBuffer)],
    })

    return new Response(JSON.stringify({
      text: response.text,
      language: response.language,
      segments: response.segments
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return new Response(JSON.stringify({ error: 'Transcription failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleAnalyze(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { transcription, songData } = await request.json()
    
    // Use QwQ model for music analysis
    const prompt = `
You are a music analysis AI. Analyze the following song information and provide insights:

Song: ${songData?.title || 'Unknown'}
Artist: ${songData?.artist || 'Unknown'}
Transcription/Humming Pattern: ${transcription}

Please provide:
1. Why this song is catchy (musical hooks, patterns)
2. Emotional impact and triggers
3. Similar songs and why they're related
4. Musical structure analysis
5. Cultural significance

Format your response as JSON with these sections: catchiness, emotional_profile, similar_songs, structure, cultural_impact.
`

    const response = await env.AI.run('@cf/qwen/qwq-32b-preview', {
      messages: [
        { role: 'system', content: 'You are a knowledgeable music analyst.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    return new Response(JSON.stringify({
      analysis: response.response
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return new Response(JSON.stringify({ error: 'Analysis failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleGenerateRemix(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { songData, style } = await request.json()
    
    // For MVP, return mock data
    // In production, this would use MeloTTS
    const mockRemixUrl = `https://example.com/remix/${style}/${Date.now()}.mp3`
    
    return new Response(JSON.stringify({
      remixUrl: mockRemixUrl,
      style: style,
      duration: '3:45'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Remix generation error:', error)
    return new Response(JSON.stringify({ error: 'Remix generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleGenerateVisual(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const { prompt, style } = await request.json()
    
    // Use FLUX model to generate visuals
    const visualPrompt = `${prompt}, ${style} style, album cover art, high quality, artistic`
    
    const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: visualPrompt,
      num_steps: 4
    })

    // Convert the image to base64
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(response.image)))
    
    return new Response(JSON.stringify({
      imageUrl: `data:image/png;base64,${base64Image}`,
      prompt: visualPrompt
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Visual generation error:', error)
    return new Response(JSON.stringify({ error: 'Visual generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}