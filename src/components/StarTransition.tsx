import { useEffect } from 'react'

interface StarTransitionProps {
  isActive: boolean
}

export default function StarTransition({ isActive }: StarTransitionProps) {
  useEffect(() => {
    console.log('StarTransition isActive changed:', isActive)
  }, [isActive])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 bg-black z-40 transition-all duration-1000" style={{ pointerEvents: 'none' }}>
      {/* Gradient overlay that fades in */}
      <div 
        className="absolute inset-0 transition-opacity duration-2000"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 70%, black 100%)',
          opacity: isActive ? 1 : 0
        }}
      />
      
      {/* Simplified star effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              backgroundColor: '#ffffff',
              opacity: Math.random() * 0.8 + 0.2,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

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

      <style>{`
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