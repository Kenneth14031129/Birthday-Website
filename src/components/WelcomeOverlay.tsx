import { useState, useEffect } from 'react'

interface WelcomeOverlayProps {
  onComplete: () => void
}

export default function WelcomeOverlay({ onComplete }: WelcomeOverlayProps) {
  const [phase, setPhase] = useState<'fireworks' | 'countdown' | 'message' | 'date' | 'complete'>('fireworks')
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Start countdown after fireworks display time
    const fireworksTimer = setTimeout(() => {
      setPhase('countdown')
    }, 3500) // Let fireworks show for 3.5 seconds

    return () => clearTimeout(fireworksTimer)
  }, [])

  useEffect(() => {
    if (phase === 'countdown') {
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            setPhase('message')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'message') {
      const messageTimer = setTimeout(() => {
        setPhase('date')
      }, 2500)

      return () => clearTimeout(messageTimer)
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'date') {
      const dateTimer = setTimeout(() => {
        setPhase('complete')
        onComplete()
      }, 3000)

      return () => clearTimeout(dateTimer)
    }
  }, [phase, onComplete])

  if (phase === 'complete') return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Fireworks are now handled by ContinuousFireworks component */}

      {/* Countdown */}
      {phase === 'countdown' && countdown > 0 && (
        <div 
          className="text-white text-9xl font-bold"
          style={{ 
            fontFamily: 'Poppins, sans-serif',
            textShadow: '0 0 20px #10b981, 0 0 40px #10b981, 0 0 60px #10b981'
          }}
        >
          {countdown}
        </div>
      )}

      {/* Happy Birthday Message */}
      {phase === 'message' && (
        <div 
          className="text-white text-6xl text-center"
          style={{ 
            fontFamily: 'Dancing Script, cursive',
            fontWeight: 600,
            textShadow: '0 0 20px #fd79a8, 0 0 40px #fd79a8, 0 0 60px #fd79a8'
          }}
        >
          Happy Birthday My Love! 💖
        </div>
      )}

      {/* Date */}
      {phase === 'date' && (
        <div className="text-center">
          <div 
            className="text-white text-6xl mb-8"
            style={{ 
              fontFamily: 'Dancing Script, cursive',
              fontWeight: 600,
              textShadow: '0 0 20px #fd79a8, 0 0 40px #fd79a8, 0 0 60px #fd79a8'
            }}
          >
            Happy Birthday My Love! 💖
          </div>
          <div 
            className="text-emerald-400 text-4xl"
            style={{ 
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              textShadow: '0 0 15px #10b981, 0 0 30px #10b981, 0 0 45px #10b981'
            }}
          >
            9.11.2025
          </div>
        </div>
      )}
    </div>
  )
}