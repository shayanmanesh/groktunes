import { useState, useEffect } from 'react'
import '../styles/SongIdentifier.css'

interface SongIdentifierProps {
  audioBlob: Blob
  onSongIdentified: (song: any) => void
}

const SongIdentifier: React.FC<SongIdentifierProps> = ({ audioBlob, onSongIdentified }) => {
  const [isIdentifying, setIsIdentifying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('Preparing audio...')

  useEffect(() => {
    identifySong()
  }, [audioBlob])

  const identifySong = async () => {
    setIsIdentifying(true)
    
    try {
      // Simulate different stages of identification
      const stages = [
        { progress: 20, status: 'Converting audio to patterns...', delay: 800 },
        { progress: 40, status: 'Analyzing melody contour...', delay: 1000 },
        { progress: 60, status: 'Matching against music database...', delay: 1200 },
        { progress: 80, status: 'Verifying results...', delay: 800 },
        { progress: 100, status: 'Song identified!', delay: 600 }
      ]

      for (const stage of stages) {
        setProgress(stage.progress)
        setStatus(stage.status)
        await new Promise(resolve => setTimeout(resolve, stage.delay))
      }

      // Mock identified song data
      const mockSong = {
        title: "Don't Stop Believin'",
        artist: "Journey",
        album: "Escape",
        year: 1981,
        genre: "Rock",
        confidence: 92,
        coverUrl: "https://via.placeholder.com/300x300/4a5568/ffffff?text=Journey",
        preview: {
          spotify: "#",
          youtube: "#",
          apple: "#"
        },
        metadata: {
          bpm: 119,
          key: "E major",
          mood: "Uplifting, Nostalgic",
          energy: 0.73
        }
      }

      onSongIdentified(mockSong)
    } catch (error) {
      console.error('Error identifying song:', error)
      setStatus('Failed to identify song')
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