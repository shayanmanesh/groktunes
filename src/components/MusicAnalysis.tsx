import { useState, useEffect } from 'react'
import '../styles/MusicAnalysis.css'

interface MusicAnalysisProps {
  song: any
}

const MusicAnalysis: React.FC<MusicAnalysisProps> = ({ song }) => {
  const [analysis, setAnalysis] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'theory' | 'emotion'>('overview')

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        overview: {
          catchiness: 8.5,
          memorability: 9.0,
          uniqueness: 7.2,
          popularity: 8.8
        },
        theory: {
          structure: "Verse - Pre-Chorus - Chorus - Verse - Pre-Chorus - Chorus - Bridge - Chorus",
          keyChanges: "Modulates from E major to F# major in final chorus",
          chord_progression: "I - V - vi - IV (Classic pop progression)",
          hooks: [
            "The opening piano riff creates immediate recognition",
            "Ascending melody in 'Just a small town girl' creates emotional lift",
            "Repetition of 'Don't stop' creates an earworm effect"
          ]
        },
        emotion: {
          primary: "Hopeful",
          secondary: ["Nostalgic", "Empowering", "Adventurous"],
          energy_curve: [0.4, 0.5, 0.8, 0.5, 0.6, 0.9, 0.7, 1.0],
          cultural_impact: "Became an anthem for dreamers and underdogs, frequently used in sports events and motivational contexts"
        },
        similar_songs: [
          { title: "Eye of the Tiger", artist: "Survivor", match: 85 },
          { title: "Livin' on a Prayer", artist: "Bon Jovi", match: 82 },
          { title: "We Built This City", artist: "Starship", match: 78 }
        ]
      })
    }, 1500)
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