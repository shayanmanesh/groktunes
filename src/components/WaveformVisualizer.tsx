import { useEffect, useRef } from 'react'
import '../styles/WaveformVisualizer.css'

interface WaveformVisualizerProps {
  stream: MediaStream
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | undefined>(undefined)
  const audioContextRef = useRef<AudioContext | undefined>(undefined)
  const analyserRef = useRef<AnalyserNode | undefined>(undefined)

  useEffect(() => {
    if (!stream || !canvasRef.current) return

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.8
    source.connect(analyser)
    
    audioContextRef.current = audioContext
    analyserRef.current = analyser

    const canvas = canvasRef.current
    const canvasCtx = canvas.getContext('2d')
    if (!canvasCtx) return

    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationIdRef.current = requestAnimationFrame(draw)
      
      analyser.getByteTimeDomainData(dataArray)
      
      canvasCtx.fillStyle = '#0a0a0a'
      canvasCtx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      canvasCtx.lineWidth = 2
      canvasCtx.strokeStyle = '#00ff88'
      canvasCtx.beginPath()

      const sliceWidth = canvas.offsetWidth / bufferLength
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0
        const y = v * canvas.offsetHeight / 2

        if (i === 0) {
          canvasCtx.moveTo(x, y)
        } else {
          canvasCtx.lineTo(x, y)
        }

        x += sliceWidth
      }

      canvasCtx.lineTo(canvas.offsetWidth, canvas.offsetHeight / 2)
      canvasCtx.stroke()
    }

    draw()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [stream])

  return (
    <div className="waveform-container">
      <canvas ref={canvasRef} className="waveform-canvas" />
    </div>
  )
}

export default WaveformVisualizer