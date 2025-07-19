const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export interface TranscriptionResult {
  text: string
  language?: string
  segments?: Array<{
    start: number
    end: number
    text: string
  }>
}

export interface AnalysisResult {
  catchiness: {
    score: number
    reasons: string[]
  }
  emotional_profile: {
    primary: string
    secondary: string[]
    energy_curve: number[]
  }
  similar_songs: Array<{
    title: string
    artist: string
    match_percentage: number
    reason: string
  }>
  structure: {
    pattern: string
    key_changes: string
    chord_progression: string
  }
  cultural_impact: string
}

export interface RemixResult {
  remixUrl: string
  style: string
  duration: string
}

export interface VisualResult {
  imageUrl: string
  prompt: string
}

export class GrokTunesAPI {
  static async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    const formData = new FormData()
    formData.append('audio', audioBlob, 'audio.webm')

    const response = await fetch(`${API_BASE_URL}/api/transcribe`, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error('Failed to transcribe audio')
    }

    return response.json()
  }

  static async analyzeSong(transcription: string, songData?: any): Promise<AnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ transcription, songData })
    })

    if (!response.ok) {
      throw new Error('Failed to analyze song')
    }

    const result = await response.json()
    // Parse the analysis if it's a string
    if (typeof result.analysis === 'string') {
      try {
        return JSON.parse(result.analysis)
      } catch {
        return result.analysis
      }
    }
    return result.analysis
  }

  static async generateRemix(songData: any, style: string): Promise<RemixResult> {
    const response = await fetch(`${API_BASE_URL}/api/generate-remix`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ songData, style })
    })

    if (!response.ok) {
      throw new Error('Failed to generate remix')
    }

    return response.json()
  }

  static async generateVisual(prompt: string, style: string): Promise<VisualResult> {
    const response = await fetch(`${API_BASE_URL}/api/generate-visual`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt, style })
    })

    if (!response.ok) {
      throw new Error('Failed to generate visual')
    }

    return response.json()
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`)
      const data = await response.json()
      return data.status === 'ok'
    } catch {
      return false
    }
  }
}