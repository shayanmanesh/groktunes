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
        
        case '/api/test-ai':
          return handleTestAI(request, env, corsHeaders)
        
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
    const audioFile = formData.get('audio')
    
    if (!audioFile || typeof audioFile === 'string') {
      return new Response(JSON.stringify({ error: 'Invalid audio file' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const file = audioFile as File
    console.log('Received audio file:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Convert audio file to array buffer
    const audioBuffer = await file.arrayBuffer()
    
    console.log('Audio buffer size:', audioBuffer.byteLength)
    
    // Check if audio is too large (Whisper has limits)
    const MAX_AUDIO_SIZE = 25 * 1024 * 1024 // 25MB
    if (audioBuffer.byteLength > MAX_AUDIO_SIZE) {
      return new Response(JSON.stringify({ 
        error: 'Audio file too large',
        message: `Audio size ${audioBuffer.byteLength} bytes exceeds maximum of ${MAX_AUDIO_SIZE} bytes`
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
    
    console.log('Calling Whisper API...')
    
    // Convert to Uint8Array and then to regular array
    // Whisper expects an array of 8-bit unsigned integers
    const uint8Array = new Uint8Array(audioBuffer)
    const audioArray = [...uint8Array]
    
    console.log('Audio array length:', audioArray.length)
    
    // Use the correct Whisper model name
    const response = await env.AI.run('@cf/openai/whisper', {
      audio: audioArray,
    })

    console.log('Whisper response:', response)

    return new Response(JSON.stringify({
      text: response.text || '',
      language: response.language,
      segments: response.segments,
      // Include debug info
      debug: {
        audioSize: file.size,
        audioType: file.type,
        responseType: typeof response
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    console.error('Transcription error:', error)
    return new Response(JSON.stringify({ 
      error: 'Transcription failed',
      message: error.message || 'Unknown error',
      stack: error.stack
    }), {
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
    const data = await request.json() as { transcription: string; songData: any }
    
    // Use QwQ model for music analysis
    const prompt = `
You are a music analysis AI. Analyze the following song information and provide insights:

Song: ${data.songData?.title || 'Unknown'}
Artist: ${data.songData?.artist || 'Unknown'}
Transcription/Humming Pattern: ${data.transcription}

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
    const data = await request.json() as { songData: any; style: string }
    
    // For MVP, return mock data
    // In production, this would use MeloTTS
    const mockRemixUrl = `https://example.com/remix/${data.style}/${Date.now()}.mp3`
    
    return new Response(JSON.stringify({
      remixUrl: mockRemixUrl,
      style: data.style,
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
    const data = await request.json() as { prompt: string; style: string }
    
    // Use FLUX model to generate visuals
    const visualPrompt = `${data.prompt}, ${data.style} style, album cover art, high quality, artistic`
    
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

async function handleTestAI(request: Request, env: Env, corsHeaders: any): Promise<Response> {
  try {
    // Test if AI binding exists
    if (!env.AI) {
      return new Response(JSON.stringify({ 
        error: 'AI binding not found',
        env: Object.keys(env)
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Test with a simple text generation
    const testResponse = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: 'Say hello' }],
      max_tokens: 10
    })

    return new Response(JSON.stringify({ 
      aiBindingExists: true,
      testResponse,
      availableModels: ['@cf/openai/whisper', '@cf/qwen/qwq-32b-preview', '@cf/black-forest-labs/flux-1-schnell']
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      error: 'AI test failed',
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}