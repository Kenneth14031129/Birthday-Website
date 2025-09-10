import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BirthdayCake from './components/BirthdayCake'
import WelcomeOverlay from './components/WelcomeOverlay'
import ContinuousFireworks from './components/ContinuousFireworks'
import './galaxy.css'

function App() {
  const [showWelcome, setShowWelcome] = useState(true)

  const handleWelcomeComplete = () => {
    setShowWelcome(false)
  }

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0 galaxy-background"></div>
      
      {/* Continuous fireworks always visible */}
      <ContinuousFireworks />
      
      {/* Three.js Canvas - Only for the cake */}
      {!showWelcome && (
        <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#10b981" />
          
          <BirthdayCake />
          <OrbitControls enableZoom={false} />
        </Canvas>
      )}

      {/* HTML Overlay for welcome sequence */}
      {showWelcome && (
        <WelcomeOverlay onComplete={handleWelcomeComplete} />
      )}
      
      {!showWelcome && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <p className="text-white text-lg mb-2" style={{ fontFamily: 'Dancing Script, cursive', fontWeight: 500 }}>Make a wish and blow out the candles!</p>
          <p className="text-emerald-300 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>🎂 Blow into your microphone or click the cake! 🎂</p>
          <p className="text-emerald-200 text-xs mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Allow microphone access for the full experience ✨</p>
        </div>
      )}
    </div>
  )
}

export default App
