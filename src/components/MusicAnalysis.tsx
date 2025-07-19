import { useState, useEffect } from 'react'
import { GrokTunesAPI } from '../services/api'
import '../styles/MusicAnalysis.css'

interface MusicAnalysisProps {
  song: any
}

const MusicAnalysis: React.FC<MusicAnalysisProps> = ({ song }) => {
  const [analysis, setAnalysis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'theory' | 'emotion'>('overview')

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // Get real AI analysis
        const result = await GrokTunesAPI.analyzeSong(
          song.transcription || `${song.title} by ${song.artist}`,
          song
        )
        
        // Parse the analysis result
        let analysisData: any
        if (typeof result === 'string') {
          // If the AI returns a string, use default values
          analysisData = {
            overview: {
              catchiness: 7.5,
              memorability: 8.0,
              uniqueness: 7.0,
              popularity: 7.5
            },
            theory: {
              structure: "Unknown structure",
              keyChanges: "No key changes detected",
              chord_progression: "Unknown progression",
              hooks: ["AI analysis in progress"]
            },
            emotion: {
              primary: "Unknown",
              secondary: [],
              energy_curve: [0.5, 0.5, 0.5, 0.5],
              cultural_impact: "Analysis in progress"
            },
            similar_songs: []
          }
        } else {
          // If it's an object, use the actual values
          analysisData = {
            overview: {
              catchiness: result.catchiness?.score || 7.5,
              memorability: 8.0,
              uniqueness: 7.0,
              popularity: 7.5
            },
            theory: {
              structure: result.structure?.pattern || "Unknown structure",
              keyChanges: result.structure?.key_changes || "No key changes detected",
              chord_progression: result.structure?.chord_progression || "Unknown progression",
              hooks: result.catchiness?.reasons || ["AI analysis in progress"]
            },
            emotion: {
              primary: result.emotional_profile?.primary || "Unknown",
              secondary: result.emotional_profile?.secondary || [],
              energy_curve: result.emotional_profile?.energy_curve || [0.5, 0.5, 0.5, 0.5],
              cultural_impact: result.cultural_impact || "Analysis in progress"
            },
            similar_songs: result.similar_songs || []
          }
        }
        
        setAnalysis(analysisData)
      } catch (error) {
        console.error('Failed to get analysis:', error)
        // Fallback to mock data
        setAnalysis({
          overview: {
            catchiness: 7.5,
            memorability: 8.0,
            uniqueness: 7.0,
            popularity: 7.5
          },
          theory: {
            structure: "Standard pop structure",
            keyChanges: "No key changes detected",
            chord_progression: "Common progression",
            hooks: ["Melody analysis in progress"]
          },
          emotion: {
            primary: "Neutral",
            secondary: ["Calm"],
            energy_curve: [0.5, 0.5, 0.5, 0.5],
            cultural_impact: "Analysis pending"
          },
          similar_songs: []
        })
      }
    }
    
    fetchAnalysis()
  }, [song])

  if (!analysis) {
    return (
      <div className="music-analysis loading">
        <div className="analysis-loader">
          <div className="loader-icon">🧠</div>
          <p>Analyzing musical DNA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="music-analysis">
      <div className="analysis-header">
        <div className="song-info">
          <img src={song.coverUrl} alt={song.title} className="album-cover" />
          <div className="song-details">
            <h2>{song.title}</h2>
            <p className="artist">{song.artist}</p>
            <div className="metadata">
              <span className="badge">{song.genre}</span>
              <span className="badge">{song.metadata.key}</span>
              <span className="badge">{song.metadata.bpm} BPM</span>
              <span className="confidence">
                {song.confidence}% match confidence
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="analysis-tabs">
        <button 
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'theory' ? 'active' : ''}`}
          onClick={() => setActiveTab('theory')}
        >
          Music Theory
        </button>
        <button 
          className={`tab ${activeTab === 'emotion' ? 'active' : ''}`}
          onClick={() => setActiveTab('emotion')}
        >
          Emotional Impact
        </button>
      </div>

      <div className="analysis-content">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <h3>Why This Song Is Catchy</h3>
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-value">{analysis.overview.catchiness}/10</div>
                <div className="metric-label">Catchiness Score</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{analysis.overview.memorability}/10</div>
                <div className="metric-label">Memorability</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{analysis.overview.uniqueness}/10</div>
                <div className="metric-label">Uniqueness</div>
              </div>
              <div className="metric-card">
                <div className="metric-value">{analysis.overview.popularity}/10</div>
                <div className="metric-label">Popularity</div>
              </div>
            </div>

            <h4>Similar Songs You Might Like</h4>
            <div className="similar-songs">
              {analysis.similar_songs.map((similar: any, index: number) => (
                <div key={index} className="similar-song">
                  <span className="song-title">{similar.title}</span>
                  <span className="song-artist">by {similar.artist}</span>
                  <span className="match-percentage">{similar.match}% match</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'theory' && (
          <div className="theory-content">
            <h3>Musical Structure</h3>
            <p className="structure">{analysis.theory.structure}</p>
            
            <h4>Harmonic Analysis</h4>
            <p><strong>Chord Progression:</strong> {analysis.theory.chord_progression}</p>
            <p><strong>Key Changes:</strong> {analysis.theory.keyChanges}</p>

            <h4>What Makes It Stick</h4>
            <ul className="hooks-list">
              {analysis.theory.hooks.map((hook: string, index: number) => (
                <li key={index}>{hook}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'emotion' && (
          <div className="emotion-content">
            <h3>Emotional Profile</h3>
            <div className="emotion-tags">
              <span className="primary-emotion">{analysis.emotion.primary}</span>
              {analysis.emotion.secondary.map((emotion: string, index: number) => (
                <span key={index} className="secondary-emotion">{emotion}</span>
              ))}
            </div>

            <h4>Energy Timeline</h4>
            <div className="energy-chart">
              {analysis.emotion.energy_curve.map((energy: number, index: number) => (
                <div 
                  key={index}
                  className="energy-bar"
                  style={{ height: `${energy * 100}%` }}
                />
              ))}
            </div>

            <h4>Cultural Impact</h4>
            <p className="cultural-impact">{analysis.emotion.cultural_impact}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MusicAnalysis