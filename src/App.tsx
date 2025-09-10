import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BirthdayCake from './components/BirthdayCake'
import WelcomeOverlay from './components/WelcomeOverlay'
import ContinuousFireworks from './components/ContinuousFireworks'
import StarTransition from './components/StarTransition'
import Universe from './components/Universe'
import './galaxy.css'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showUniverse, setShowUniverse] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const audioRef = useRef<HTMLVideoElement>(null)

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
  }

  const handleUniverseTransition = () => {
    setIsTransitioning(true)
    // Wait for star transition effect, then show universe
    setTimeout(() => {
      setShowUniverse(true)
      setIsTransitioning(false)
    }, 3000) // 3 second star transition
  }

  // Initialize and try to start music immediately when page loads
  useEffect(() => {
    const initializeMusic = async () => {
      if (audioRef.current) {
        // Set volume
        audioRef.current.volume = 0.3
        
        // Try to start music immediately on page load
        try {
          await audioRef.current.play()
          console.log('Music started immediately on page load!')
        } catch (error) {
          console.log('Autoplay blocked on page load - will try during countdown')
        }
      }
    }
    
    // Try immediately
    initializeMusic()
    
    // Also try when DOM is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeMusic)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 galaxy-background"></div>
      
      {/* Background Music - Invisible Video */}
      <video
        ref={audioRef}
        loop
        muted={false}
        preload="auto"
        playsInline
        onLoadedData={() => console.log('Video loaded and ready to play')}
        onPlay={() => console.log('Music started playing!')}
        onPause={() => console.log('Music paused')}
        onError={(e) => console.log('Video error:', e)}
        style={{ 
          display: 'none',
          position: 'absolute',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <source src="/music/16397683-6878-466c-9fda-541ce52464a3.mp4" type="video/mp4" />
        Your browser does not support the video element.
      </video>
      
      {/* Continuous fireworks - only visible when not in universe */}
      {!showUniverse && <ContinuousFireworks />}
      
      {/* Three.js Canvas - Only for the cake */}
      {!showWelcome && !showUniverse && !isTransitioning && (
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#10b981" />
          
          <BirthdayCake onAllCandlesBlown={handleUniverseTransition} />
          <OrbitControls enableZoom={false} />
        </Canvas>
      )}

      {/* HTML Overlay for welcome sequence */}
      {showWelcome && (
        <WelcomeOverlay onComplete={handleWelcomeComplete} audioRef={audioRef} />
      )}
      
      {!showWelcome && !showUniverse && !isTransitioning && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <p className="text-white text-lg mb-2" style={{ fontFamily: 'Dancing Script, cursive', fontWeight: 500 }}>Make a wish and blow out the candles!</p>
          <p className="text-emerald-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>🎂 Blow into your microphone or click the cake! 🎂</p>
          <p className="text-emerald-200 text-xs mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Allow microphone access for the full experience ✨</p>
        </div>
      )}

      {/* Star transition effect */}
      <StarTransition isActive={isTransitioning} />

      {/* Universe page */}
      {showUniverse && <Universe />}
    </div>
  )
}

export default App
