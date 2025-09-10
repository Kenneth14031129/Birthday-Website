import { useState, useEffect, RefObject } from 'react'

interface WelcomeOverlayProps {
  onComplete: () => void
  audioRef: RefObject<HTMLVideoElement>
}

export default function WelcomeOverlay({ onComplete, audioRef }: WelcomeOverlayProps) {
  const [phase, setPhase] = useState<'fireworks' | 'countdown' | 'message' | 'date' | 'complete'>('fireworks')
  const [countdown, setCountdown] = useState(3)

  // Try to start music immediately when WelcomeOverlay mounts (right at the beginning)
  useEffect(() => {
    const startMusicEarly = async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play()
          console.log('Music started early in WelcomeOverlay!')
        } catch (error) {
          console.log('Early music start blocked, will retry')
          
          // Set up listener for any interaction to start music
          const startOnInteraction = async () => {
            try {
              await audioRef.current?.play()
              console.log('Music started on interaction!')
              document.removeEventListener('click', startOnInteraction)
              document.removeEventListener('touchstart', startOnInteraction)
              document.removeEventListener('keydown', startOnInteraction)
            } catch (err) {
              console.log('Failed to start music on interaction:', err)
            }
          }
          
          document.addEventListener('click', startOnInteraction)
          document.addEventListener('touchstart', startOnInteraction) 
          document.addEventListener('keydown', startOnInteraction)
        }
      }
    }
    
    startMusicEarly()
  }, [audioRef])

  useEffect(() => {
    // Start countdown after fireworks display time
    const fireworksTimer = setTimeout(() => {
      setPhase('countdown')
    }, 3500) // Let fireworks show for 3.5 seconds

    return () => clearTimeout(fireworksTimer)
  }, [])

  useEffect(() => {
    if (phase === 'countdown') {
      // Start background music when countdown begins
      const startBackgroundMusic = async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play()
            console.log('Background music started during countdown!')
          } catch (error) {
            console.log('Autoplay blocked, trying alternative methods')
            
            // Force play on any interaction during countdown
            const forceStart = async () => {
              try {
                await audioRef.current?.play()
                document.removeEventListener('click', forceStart)
                document.removeEventListener('touchstart', forceStart)
                document.removeEventListener('keydown', forceStart)
                document.removeEventListener('mousemove', forceStart)
                console.log('Background music started on user interaction during countdown')
              } catch (err) {
                console.log('Could not start music:', err)
              }
            }
            
            // Listen for any user interaction
            document.addEventListener('click', forceStart)
            document.addEventListener('touchstart', forceStart)
            document.addEventListener('keydown', forceStart)
            document.addEventListener('mousemove', forceStart)
          }
        }
      }
      
      startBackgroundMusic()
      
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
  }, [phase, audioRef])

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