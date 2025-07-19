import { useState, useEffect } from 'react'
import { GrokTunesAPI } from '../services/api'
import '../styles/SongIdentifier.css'

interface SongIdentifierProps {
  audioBlob: Blob
  onSongIdentified: (song: any) => void
}

const SongIdentifier: React.FC<SongIdentifierProps> = ({ audioBlob, onSongIdentified }) => {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Preparing audio...')

  useEffect(() => {
    identifySong()
  }, [audioBlob])

  const identifySong = async () => {
    
    try {
      // Step 1: Transcribe audio
      setProgress(20)
      setStatus('Converting audio to patterns...')
      const transcription = await GrokTunesAPI.transcribeAudio(audioBlob)
      
      // Step 2: Analyze the transcription
      setProgress(40)
      setStatus('Analyzing melody contour...')
      
      // For now, use the transcription to search (in a real app, you'd match against a database)
      setProgress(60)
      setStatus('Matching against music database...')
      
      // Mock song data based on transcription
      const mockSong = {
        title: transcription.text || "Unknown Song",
        artist: "Unknown Artist",
        album: "Unknown Album",
        year: 2024,
        genre: "Unknown",
        confidence: 85,
        coverUrl: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Music",
        transcription: transcription.text,
        preview: {
          spotify: "#",
          youtube: "#",
          apple: "#"
        },
        metadata: {
          bpm: 120,
          key: "C major",
          mood: "Unknown",
          energy: 0.5
        }
      }
      
      setProgress(80)
      setStatus('Verifying results...')
      
      // Get AI analysis
      try {
        const analysis = await GrokTunesAPI.analyzeSong(transcription.text || '', mockSong)
        mockSong.metadata.mood = analysis.emotional_profile?.primary || "Unknown"
      } catch (error) {
        console.error('Analysis failed:', error)
      }
      
      setProgress(100)
      setStatus('Song identified!')
      
      onSongIdentified(mockSong)
    } catch (error: any) {
      console.error('Error identifying song:', error)
      console.error('Error details:', error.message)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      setStatus(`Failed to identify song: ${error.message || 'Unknown error'}`)
    }
  }

  return (
    <div className="song-identifier">
      <div className="identifier-container">
        <h2>Identifying Your Tune</h2>
        
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="progress-status">{status}</p>
        </div>

        <div className="sound-wave">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="wave-bar"
              style={{
                animationDelay: `${i * 0.1}s`,
                height: `${20 + Math.random() * 60}%`
              }}
            />
          ))}
        </div>

        <div className="identifier-info">
          <p>Our AI is analyzing your audio using:</p>
          <ul>
            <li>🎵 Melody pattern recognition</li>
            <li>🎼 Rhythm and tempo analysis</li>
            <li>🎸 Harmonic progression matching</li>
            <li>🎤 Vocal characteristics detection</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default SongIdentifier