import { useRef, useState, useEffect, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import { Cylinder, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useAudioDetection } from '../hooks/useAudioDetection'

interface CandleProps {
  position: [number, number, number]
  isLit: boolean
}

function Candle({ position, isLit }: CandleProps) {
  const flameGroupRef = useRef<THREE.Group>(null)
  const flame1Ref = useRef<THREE.Mesh>(null)
  const flame2Ref = useRef<THREE.Mesh>(null)
  const flame3Ref = useRef<THREE.Mesh>(null)
  const light1Ref = useRef<THREE.PointLight>(null)
  const light2Ref = useRef<THREE.PointLight>(null)

  // Create custom flame shape using bezier curves
  const createFlameGeometry = (scale = 1) => {
    const flameShape = new THREE.Shape()
    
    // Start at bottom center
    flameShape.moveTo(0, 0)
    
    // Left side with bezier curve (wide base to narrow tip)
    flameShape.bezierCurveTo(
      -0.6 * scale, 0.1 * scale,  // control point 1
      -0.8 * scale, 0.4 * scale,  // control point 2
      -0.4 * scale, 0.8 * scale   // end point
    )
    
    // Left flame tip curve
    flameShape.bezierCurveTo(
      -0.3 * scale, 1.0 * scale,  // control point 1
      -0.1 * scale, 1.2 * scale,  // control point 2
      0, 1.3 * scale              // flame tip
    )
    
    // Right flame tip curve
    flameShape.bezierCurveTo(
      0.1 * scale, 1.2 * scale,   // control point 1
      0.3 * scale, 1.0 * scale,   // control point 2
      0.4 * scale, 0.8 * scale    // end point
    )
    
    // Right side with bezier curve (narrow tip to wide base)
    flameShape.bezierCurveTo(
      0.8 * scale, 0.4 * scale,   // control point 1
      0.6 * scale, 0.1 * scale,   // control point 2
      0, 0                        // back to start
    )
    
    const geometry = new THREE.ExtrudeGeometry(flameShape, {
      depth: 0.02 * scale,
      bevelEnabled: false
    })
    
    // Center the geometry
    geometry.translate(0, -0.2 * scale, 0)
    
    return geometry
  }
  
useFrame((state) => {
  if (flameGroupRef.current && isLit) {
    const time = state.clock.elapsedTime
    
    // Fixed flame movement - use relative positioning, not absolute
    flameGroupRef.current.position.x = Math.sin(time * 3) * 0.02  // Remove position[0] +
    flameGroupRef.current.position.y = 0.6 + Math.sin(time * 4) * 0.03  // Remove position[1] +
    flameGroupRef.current.position.z = Math.sin(time * 2.5) * 0.01  // Add slight z movement
    
    // Individual flame animations (these are fine)
    if (flame1Ref.current) {
      flame1Ref.current.scale.y = 1 + Math.sin(time * 6) * 0.3
      flame1Ref.current.scale.x = 1 + Math.sin(time * 5) * 0.2
    }
    
    if (flame2Ref.current) {
      flame2Ref.current.scale.y = 0.8 + Math.sin(time * 7 + 1) * 0.25
      flame2Ref.current.scale.x = 0.8 + Math.sin(time * 8 + 1) * 0.15
      flame2Ref.current.position.y = 0.15 + Math.sin(time * 6) * 0.05
    }
    
    if (flame3Ref.current) {
      flame3Ref.current.scale.setScalar(0.6 + Math.sin(time * 9 + 2) * 0.2)
      flame3Ref.current.position.y = 0.25 + Math.sin(time * 8) * 0.03
    }
  }
})

  return (
    <group position={position}>
      {/* Candle stick */}
      <Cylinder args={[0.03, 0.03, 0.5]} position={[0, 0.25, 0]}>
        <meshStandardMaterial color="#f4e4bc" />
      </Cylinder>
      
      {/* Candle wick */}
      <Cylinder args={[0.005, 0.005, 0.08]} position={[0, 0.54, 0]}>
        <meshStandardMaterial color="#2d1810" />
      </Cylinder>
      
      {/* Flame layers */}
      {isLit && (
        <group ref={flameGroupRef} position={[0, 0.6, 0]}>
          {/* Main flame (red-orange core) */}
          <mesh ref={flame1Ref} position={[0, 0, 0]} rotation={[0, 0, 0]}>
            <primitive object={createFlameGeometry(0.06)} />
            <meshBasicMaterial 
              color="#ff4500" 
              transparent 
              opacity={0.9}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Light at main flame position */}
          <pointLight
            ref={light1Ref}
            position={[0, 0.04, 0]}
            color="#ff4500"
            intensity={4}
            distance={0.2}
            decay={2}
          />
          
          {/* Middle flame (orange-yellow) */}
          <mesh ref={flame2Ref} position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
            <primitive object={createFlameGeometry(0.08)} />
            <meshBasicMaterial 
              color="#ff6b00" 
              transparent 
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          
          {/* Light at middle flame position */}
          <pointLight
            ref={light2Ref}
            position={[0, 0.15, 0]}
            color="#ff6b00"
            intensity={2}
            distance={0.15}
            decay={2}
          />
          
          {/* Outer flame (yellow-white) */}
          <mesh ref={flame3Ref} position={[0, 0.2, 0]} rotation={[0, 0, 0]}>
            <primitive object={createFlameGeometry(0.05)} />
            <meshBasicMaterial 
              color="#ffaa00" 
              transparent 
              opacity={0.5}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}
    </group>
  )
}

export default function BirthdayCake() {
  const cakeRef = useRef<THREE.Group>(null)
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true])
  const { startListening, isListening, isBlowing } = useAudioDetection({
    threshold: 0.015,
    sensitivity: 2,
    cooldown: 800
  })

  useFrame(() => {
    if (cakeRef.current) {
      cakeRef.current.rotation.y += 0.003
    }
  })

  const blowOutCandles = useCallback(() => {
    candlesLit.forEach((_, index) => {
      setTimeout(() => {
        setCandlesLit(prev => {
          const newState = [...prev]
          newState[index] = false
          return newState
        })
      }, index * 200)
    })
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCandlesLit([true, true, true, true, true])
    }, 3000)
  }, [candlesLit])

  // Start microphone listening on component mount
  useEffect(() => {
    if (!isListening) {
      startListening()
    }
  }, [startListening, isListening])

  // Handle blow detection from microphone
  useEffect(() => {
    if (isBlowing) {
      blowOutCandles()
    }
  }, [isBlowing, blowOutCandles])

  const handleClick = () => {
    // Fallback for when microphone isn't available
    blowOutCandles()
  }

  return (
    <group ref={cakeRef} onClick={handleClick}>
      {/* Cake base */}
      <Cylinder args={[1.5, 1.5, 0.8]} position={[0, -0.4, 0]}>
        <meshStandardMaterial color="#047857" />
      </Cylinder>
      
      {/* Cake middle layer */}
      <Cylinder args={[1.2, 1.2, 0.6]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#10b981" />
      </Cylinder>
      
      {/* Cake top layer */}
      <Cylinder args={[0.9, 0.9, 0.5]} position={[0, 0.55, 0]}>
        <meshStandardMaterial color="#6ee7b7" />
      </Cylinder>
      
      {/* Smooth icing layer on top */}
      <Cylinder args={[0.92, 0.92, 0.02]} position={[0, 0.81, 0]}>
        <meshStandardMaterial color="#f0fdf4" roughness={0.1} metalness={0.1} />
      </Cylinder>
      
      {/* Piped icing borders around cake layers */}
      {/* Bottom layer border */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2
        const x = Math.cos(angle) * 1.5
        const z = Math.sin(angle) * 1.5
        return (
          <Sphere key={`bottom-border-${i}`} args={[0.04]} position={[x, 0, z]}>
            <meshStandardMaterial color="#f0fdf4" />
          </Sphere>
        )
      })}
      
      {/* Middle layer border */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2
        const x = Math.cos(angle) * 1.2
        const z = Math.sin(angle) * 1.2
        return (
          <Sphere key={`middle-border-${i}`} args={[0.035]} position={[x, 0.4, z]}>
            <meshStandardMaterial color="#dcfce7" />
          </Sphere>
        )
      })}
      
      {/* Top layer border */}
      {Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * Math.PI * 2
        const x = Math.cos(angle) * 0.9
        const z = Math.sin(angle) * 0.9
        return (
          <Sphere key={`top-border-${i}`} args={[0.03]} position={[x, 0.8, z]}>
            <meshStandardMaterial color="#f0fdf4" />
          </Sphere>
        )
      })}

      {/* Decorative icing rosettes */}
      <group>
        {/* Large rosettes on bottom layer */}
        <Sphere args={[0.12]} position={[1.0, 0.1, 0]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        <Sphere args={[0.08]} position={[1.0, 0.18, 0]}>
          <meshStandardMaterial color="#f0fdf4" />
        </Sphere>
        
        <Sphere args={[0.12]} position={[-1.0, 0.1, 0]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        <Sphere args={[0.08]} position={[-1.0, 0.18, 0]}>
          <meshStandardMaterial color="#f0fdf4" />
        </Sphere>
        
        <Sphere args={[0.12]} position={[0, 0.1, 1.0]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        <Sphere args={[0.08]} position={[0, 0.18, 1.0]}>
          <meshStandardMaterial color="#f0fdf4" />
        </Sphere>
        
        <Sphere args={[0.12]} position={[0, 0.1, -1.0]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        <Sphere args={[0.08]} position={[0, 0.18, -1.0]}>
          <meshStandardMaterial color="#f0fdf4" />
        </Sphere>
        
        {/* Medium rosettes on middle layer */}
        <Sphere args={[0.1]} position={[0.8, 0.5, 0.8]}>
          <meshStandardMaterial color="#d1fae5" />
        </Sphere>
        <Sphere args={[0.06]} position={[0.8, 0.56, 0.8]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        
        <Sphere args={[0.1]} position={[-0.8, 0.5, 0.8]}>
          <meshStandardMaterial color="#d1fae5" />
        </Sphere>
        <Sphere args={[0.06]} position={[-0.8, 0.56, 0.8]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        
        <Sphere args={[0.1]} position={[0.8, 0.5, -0.8]}>
          <meshStandardMaterial color="#d1fae5" />
        </Sphere>
        <Sphere args={[0.06]} position={[0.8, 0.56, -0.8]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
        
        <Sphere args={[0.1]} position={[-0.8, 0.5, -0.8]}>
          <meshStandardMaterial color="#d1fae5" />
        </Sphere>
        <Sphere args={[0.06]} position={[-0.8, 0.56, -0.8]}>
          <meshStandardMaterial color="#ecfdf5" />
        </Sphere>
      </group>

      {/* Dripping icing effects */}
      <group>
        {/* Bottom layer drips */}
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2 + 0.3
          const x = Math.cos(angle) * 1.4
          const z = Math.sin(angle) * 1.4
          const height = 0.15 + (i % 3) * 0.05
          return (
            <Cylinder key={`bottom-drip-${i}`} args={[0.02, 0.04, height]} position={[x, -0.3 - height/2, z]}>
              <meshStandardMaterial color="#f0fdf4" />
            </Cylinder>
          )
        })}
        
        {/* Middle layer drips */}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = (i / 6) * Math.PI * 2 + 0.5
          const x = Math.cos(angle) * 1.15
          const z = Math.sin(angle) * 1.15
          const height = 0.12 + (i % 2) * 0.04
          return (
            <Cylinder key={`middle-drip-${i}`} args={[0.018, 0.035, height]} position={[x, -0.15 - height/2, z]}>
              <meshStandardMaterial color="#dcfce7" />
            </Cylinder>
          )
        })}
      </group>

      {/* Swirled buttercream on top */}
      <group position={[0, 0.85, 0]}>
        {Array.from({ length: 3 }, (_, ring) => 
          Array.from({ length: 8 + ring * 4 }, (_, i) => {
            const totalPoints = 8 + ring * 4;
            const angle = (i / totalPoints) * Math.PI * 2 + ring * 0.3;
            const radius = 0.2 + ring * 0.2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            return (
              <Sphere 
                key={`swirl-${ring}-${i}`} 
                args={[0.025 + ring * 0.01]} 
                position={[x, ring * 0.03, z]}
              >
                <meshStandardMaterial 
                  color={ring === 0 ? "#f8fafc" : ring === 1 ? "#f1f5f9" : "#e2e8f0"} 
                  roughness={0.3}
                />
              </Sphere>
            );
          })
        )}
      </group>
      
      {/* Candles */}
      <Candle position={[0, 0.8, 0]} isLit={candlesLit[0]} />
      <Candle position={[0.4, 0.8, 0.4]} isLit={candlesLit[1]} />
      <Candle position={[-0.4, 0.8, 0.4]} isLit={candlesLit[2]} />
      <Candle position={[0.4, 0.8, -0.4]} isLit={candlesLit[3]} />
      <Candle position={[-0.4, 0.8, -0.4]} isLit={candlesLit[4]} />
    </group>
  )
}