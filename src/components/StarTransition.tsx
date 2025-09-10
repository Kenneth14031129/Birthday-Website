import { useState, useEffect } from 'react'

interface StarTransitionProps {
  isActive: boolean
}

export default function StarTransition({ isActive }: StarTransitionProps) {
  const [stars, setStars] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    color: string
    delay: number
  }>>([])

  useEffect(() => {
    if (isActive) {
      // Create stars for transition
      const newStars = []
      for (let i = 0; i < 200; i++) {
        newStars.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 1,
          opacity: 0,
          color: ['#ffffff', '#fbbf24', '#8b5cf6', '#06b6d4', '#ec4899'][Math.floor(Math.random() * 5)],
          delay: Math.random() * 2000 // Random delay up to 2 seconds
        })
      }
      setStars(newStars)
    }
  }, [isActive])

  useEffect(() => {
    if (isActive && stars.length > 0) {
      // Animate stars appearing
      stars.forEach(star => {
        setTimeout(() => {
          setStars(prevStars =>
            prevStars.map(s =>
              s.id === star.id ? { ...s, opacity: 1 } : s
            )
          )
        }, star.delay)
      })
    }
  }, [isActive, stars.length])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black z-40 transition-all duration-1000">
      {/* Gradient overlay that fades in */}
      <div 
        className="absolute inset-0 transition-opacity duration-2000"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 70%, black 100%)',
          opacity: isActive ? 1 : 0
        }}
      />
      
      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full transition-all duration-1000 ease-out"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
            animation: star.opacity > 0 ? 'starPulse 2s ease-in-out infinite' : 'none'
          }}
        />
      ))}

      {/* Central message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="text-center transition-all duration-2000 delay-1000"
          style={{
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1)' : 'scale(0.5)'
          }}
        >
          <h2 
            className="text-4xl font-bold text-white mb-4 animate-pulse"
            style={{ fontFamily: 'Dancing Script, cursive' }}
          >
            Make another wish...
          </h2>
          <p 
            className="text-xl text-purple-200"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            ✨ Traveling to infinite universes ✨
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes starPulse {
          0%, 100% { 
            opacity: 0.5; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  )
}