import { useState } from 'react'
import { GrokTunesAPI } from '../services/api'
import '../styles/RemixGenerator.css'

interface RemixGeneratorProps {
  song: any
}

type RemixStyle = 'jazz' | 'lofi' | 'classical' | 'edm' | 'acoustic' | 'synthwave'

interface Remix {
  style: RemixStyle
  description: string
  audioUrl?: string
  visualUrl?: string
  isGenerating?: boolean
}

const RemixGenerator: React.FC<RemixGeneratorProps> = ({ song }) => {
  const [selectedStyle, setSelectedStyle] = useState<RemixStyle | null>(null)
  const [generatedRemix, setGeneratedRemix] = useState<Remix | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const remixStyles: Array<{ id: RemixStyle; name: string; icon: string; description: string }> = [
    { 
      id: 'jazz', 
      name: 'Jazz', 
      icon: '🎷', 
      description: 'Smooth jazz interpretation with complex harmonies' 
    },
    { 
      id: 'lofi', 
      name: 'Lo-Fi', 
      icon: '🎧', 
      description: 'Chill, nostalgic vibes with vinyl crackle' 
    },
    { 
      id: 'classical', 
      name: 'Classical', 
      icon: '🎻', 
      description: 'Orchestral arrangement with strings and brass' 
    },
    { 
      id: 'edm', 
      name: 'EDM', 
      icon: '🎛️', 
      description: 'Electronic dance remix with heavy bass' 
    },
    { 
      id: 'acoustic', 
      name: 'Acoustic', 
      icon: '🎸', 
      description: 'Stripped-down acoustic guitar version' 
    },
    { 
      id: 'synthwave', 
      name: 'Synthwave', 
      icon: '🌃', 
      description: '80s-inspired retro-futuristic sound' 
    }
  ]

  const generateRemix = async (style: RemixStyle) => {
    setIsGenerating(true)
    setSelectedStyle(style)

    try {
      // Generate remix with AI
      const remixResult = await GrokTunesAPI.generateRemix(song, style)
      
      // Generate visual with FLUX
      const visualPrompt = `${style} music album cover for "${song.title}" by ${song.artist}, abstract, artistic, modern`
      const visualResult = await GrokTunesAPI.generateVisual(visualPrompt, style)
      
      setGeneratedRemix({
        style,
        description: `AI-generated ${style} remix of "${song.title}"`,
        audioUrl: remixResult.remixUrl,
        visualUrl: visualResult.imageUrl
      })
    } catch (error) {
      console.error('Failed to generate remix:', error)
      // Fallback to placeholder
      setGeneratedRemix({
        style,
        description: `AI-generated ${style} remix of "${song.title}"`,
        audioUrl: '#',
        visualUrl: `https://via.placeholder.com/600x400/9333ea/ffffff?text=${style.toUpperCase()}+REMIX`
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const shareRemix = () => {
    // Implement sharing functionality
    alert('Sharing functionality would be implemented here!')
  }

  return (
    <div className="remix-generator">
      <div className="generator-header">
        <h2>Create AI Remixes</h2>
        <p>Transform "{song.title}" into different musical styles</p>
      </div>

      {!generatedRemix && (
        <div className="remix-styles-grid">
          {remixStyles.map((style) => (
            <button
              key={style.id}
              className={`remix-style-card ${selectedStyle === style.id ? 'selected' : ''}`}
              onClick={() => generateRemix(style.id)}
              disabled={isGenerating}
            >
              <div className="style-icon">{style.icon}</div>
              <h3>{style.name}</h3>
              <p>{style.description}</p>
              {isGenerating && selectedStyle === style.id && (
                <div className="generating-overlay">
                  <div className="spinner"></div>
                  <span>Generating...</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {generatedRemix && !isGenerating && (
        <div className="generated-remix">
          <div className="remix-visualization">
            <img 
              src={generatedRemix.visualUrl} 
              alt={`${generatedRemix.style} remix visualization`}
              className="remix-visual"
            />
            <div className="visual-overlay">
              <h3>{generatedRemix.style.toUpperCase()} REMIX</h3>
              <p>{song.title} - {song.artist}</p>
            </div>
          </div>

          <div className="remix-player">
            <div className="player-info">
              <h4>{generatedRemix.description}</h4>
              <p>AI-powered musical transformation</p>
            </div>
            <div className="player-controls">
              <button className="play-button">
                ▶️ Play Remix
              </button>
            </div>
          </div>

          <div className="remix-actions">
            <button className="action-btn" onClick={() => setGeneratedRemix(null)}>
              🔄 Generate Another
            </button>
            <button className="action-btn primary" onClick={shareRemix}>
              📤 Share Remix
            </button>
          </div>

          <div className="remix-challenge">
            <h4>🎮 Grok Battle Challenge</h4>
            <p>Challenge your friends to identify the original song from this remix!</p>
            <button className="challenge-btn">Create Challenge</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RemixGenerator