import { useState, useRef, useEffect } from 'react'
import WaveformVisualizer from './WaveformVisualizer'
import '../styles/AudioRecorder.css'

interface AudioRecorderProps {
  onAudioCapture: (blob: Blob) => void
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioCapture }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [textDescription, setTextDescription] = useState('')
  const [inputMode, setInputMode] = useState<'audio' | 'text'>('audio')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      // Try to use a specific codec for better compatibility
      let options: MediaRecorderOptions = {}
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options = { mimeType: 'audio/webm;codecs=opus' }
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' }
      }
      
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      console.log('Recording with mimeType:', mediaRecorder.mimeType)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        console.log('Created audio blob:', {
          size: blob.size,
          type: blob.type
        })
        
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        onAudioCapture(blob)
        
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(100) // Capture data every 100ms
      setIsRecording(true)
      
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Please allow microphone access to record audio')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const resetRecording = () => {
    setAudioURL(null)
    setRecordingTime(0)
    chunksRef.current = []
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleTextSubmit = () => {
    if (textDescription.trim()) {
      // Create a fake audio blob with the text description
      const textBlob = new Blob([textDescription], { type: 'text/plain' })
      // Add a custom property to indicate this is text
      ;(textBlob as any).isTextDescription = true
      ;(textBlob as any).textContent = textDescription
      onAudioCapture(textBlob)
    }
  }

  return (
    <div className="audio-recorder">
      <div className="recorder-header">
        <h2>Hum, Whistle, or Describe Your Tune</h2>
        <p className="recorder-subtitle">
          Can't remember the name? Just give us a melody!
        </p>
      </div>

      <div className="recorder-container">
        <div className="input-mode-selector">
          <button 
            className={`mode-btn ${inputMode === 'audio' ? 'active' : ''}`}
            onClick={() => setInputMode('audio')}
          >
            🎤 Record Audio
          </button>
          <button 
            className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`}
            onClick={() => setInputMode('text')}
          >
            📝 Describe Song
          </button>
        </div>

        {inputMode === 'audio' ? (
          <>
            {streamRef.current && isRecording && (
              <WaveformVisualizer stream={streamRef.current} />
            )}

            <div className="recorder-controls">
          {!isRecording && !audioURL && (
            <button className="record-btn start" onClick={startRecording}>
              <span className="record-icon">🎤</span>
              Start Recording
            </button>
          )}

          {isRecording && (
            <>
              <div className="recording-indicator">
                <span className="recording-dot"></span>
                Recording... {formatTime(recordingTime)}
              </div>
              <button className="record-btn stop" onClick={stopRecording}>
                <span className="stop-icon">⏹</span>
                Stop Recording
              </button>
            </>
          )}

          {audioURL && !isRecording && (
            <div className="playback-controls">
              <audio controls src={audioURL} />
              <div className="playback-actions">
                <button className="action-btn" onClick={resetRecording}>
                  <span>🔄</span> Record Again
                </button>
                <button className="action-btn primary" onClick={() => {}}>
                  <span>🔍</span> Identify Song
                </button>
              </div>
            </div>
          )}
        </div>
          </>
        ) : (
          <div className="text-input-container">
            <textarea
              className="text-description-input"
              placeholder="Describe the song... e.g., 'Rocky theme song with trumpets' or 'That 80s song that goes dun dun dun'"
              value={textDescription}
              onChange={(e) => setTextDescription(e.target.value)}
              rows={4}
            />
            <button 
              className="action-btn primary"
              onClick={handleTextSubmit}
              disabled={!textDescription.trim()}
            >
              <span>🔍</span> Identify Song
            </button>
          </div>
        )}

        <div className="recorder-tips">
          <h3>Tips for Better Results:</h3>
          <ul>
            <li>Hum the melody clearly for 10-15 seconds</li>
            <li>Include the most memorable part of the song</li>
            <li>You can also describe it: "80s synth song with drums"</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AudioRecorder