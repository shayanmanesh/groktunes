import { useState } from 'react'
import AudioRecorder from './components/AudioRecorder'
import SongIdentifier from './components/SongIdentifier'
import MusicAnalysis from './components/MusicAnalysis'
import RemixGenerator from './components/RemixGenerator'
import './styles/App.css'

type AppMode = 'record' | 'identify' | 'analyze' | 'remix'

function App() {
  const [mode, setMode] = useState<AppMode>('record')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [identifiedSong, setIdentifiedSong] = useState<any>(null)

  const handleAudioCapture = (blob: Blob) => {
    setAudioBlob(blob)
    setMode('identify')
  }

  const handleSongIdentified = (song: any) => {
    setIdentifiedSong(song)
    setMode('analyze')
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo-container">
          <h1 className="app-title">GrokTunes<span className="ai-badge">.ai</span></h1>
          <p className="app-tagline">The AI Music Mind Reader</p>
        </div>
        <nav className="app-nav">
          <button 
            className={`nav-btn ${mode === 'record' ? 'active' : ''}`}
            onClick={() => setMode('record')}
          >
            Record
          </button>
          <button 
            className={`nav-btn ${mode === 'identify' ? 'active' : ''}`}
            onClick={() => setMode('identify')}
            disabled={!audioBlob}
          >
            Identify
          </button>
          <button 
            className={`nav-btn ${mode === 'analyze' ? 'active' : ''}`}
            onClick={() => setMode('analyze')}
            disabled={!identifiedSong}
          >
            Analyze
          </button>
          <button 
            className={`nav-btn ${mode === 'remix' ? 'active' : ''}`}
            onClick={() => setMode('remix')}
            disabled={!identifiedSong}
          >
            Remix
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className="mode-container">
          {mode === 'record' && (
            <AudioRecorder onAudioCapture={handleAudioCapture} />
          )}
          
          {mode === 'identify' && audioBlob && (
            <SongIdentifier 
              audioBlob={audioBlob} 
              onSongIdentified={handleSongIdentified}
            />
          )}
          
          {mode === 'analyze' && identifiedSong && (
            <MusicAnalysis song={identifiedSong} />
          )}
          
          {mode === 'remix' && identifiedSong && (
            <RemixGenerator song={identifiedSong} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Cloudflare AI Models</p>
      </footer>
    </div>
  )
}

export default App