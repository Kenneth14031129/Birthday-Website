import { useState, useEffect } from 'react'

interface UniverseData {
  id: number
  title: string
  message: string
  planetType: 'gas-giant' | 'rocky' | 'ice' | 'lava' | 'forest' | 'crystal' | 'nebula'
  colors: string[]
  size: number
  hasRings?: boolean
  moons?: number
}

const universes: UniverseData[] = [
  {
    id: 1,
    title: "In the Quantum Universe",
    message: "Where particles dance in infinite possibilities, you are my only certainty.",
    planetType: 'crystal',
    colors: ['#8b5cf6', '#a78bfa', '#c084fc'],
    size: 120,
    hasRings: true,
    moons: 2
  },
  {
    id: 2,
    title: "In the Ocean Universe", 
    message: "Where waves crash against distant shores, you are my calm in every storm.",
    planetType: 'ice',
    colors: ['#06b6d4', '#67e8f9', '#0891b2'],
    size: 100,
    moons: 1
  },
  {
    id: 3,
    title: "In the Fire Universe",
    message: "Where stars burn bright in cosmic darkness, you are my eternal flame.",
    planetType: 'lava',
    colors: ['#f59e0b', '#fbbf24', '#dc2626'],
    size: 90,
    hasRings: false
  },
  {
    id: 4,
    title: "In the Crystal Universe",
    message: "Where light refracts into rainbow fractals, you are my perfect clarity.",
    planetType: 'crystal',
    colors: ['#ec4899', '#f472b6', '#db2777'],
    size: 110,
    hasRings: true,
    moons: 3
  },
  {
    id: 5,
    title: "In the Garden Universe",
    message: "Where flowers bloom in endless spring, you are my most beautiful blossom.",
    planetType: 'forest',
    colors: ['#10b981', '#34d399', '#059669'],
    size: 95,
    moons: 1
  },
  {
    id: 6,
    title: "In the Music Universe",
    message: "Where melodies echo through space and time, you are my sweetest symphony.",
    planetType: 'gas-giant',
    colors: ['#8b5cf6', '#c084fc', '#7c3aed'],
    size: 130,
    hasRings: true,
    moons: 4
  },
  {
    id: 7,
    title: "In the Dream Universe",
    message: "Where thoughts become reality and wishes come true, you are my greatest dream.",
    planetType: 'nebula',
    colors: ['#f472b6', '#f9a8d4', '#ec4899'],
    size: 85,
    moons: 0
  }
]

export default function Universe() {
  const [selectedUniverse, setSelectedUniverse] = useState<UniverseData | null>(null)
  const [stars, setStars] = useState<Array<{
    id: number
    x: number
    y: number
    size: number
    opacity: number
    twinkleSpeed: number
  }>>([])
  
  const [cosmicDust, setCosmicDust] = useState<Array<{
    id: number
    x: number
    y: number
    vx: number
    vy: number
    size: number
    opacity: number
    color: string
  }>>([])
  
  const [gravitationalStreams, setGravitationalStreams] = useState<Array<{
    id: number
    fromPlanet: number
    toPlanet: number
    particles: Array<{
      x: number
      y: number
      progress: number
      color: string
      size: number
    }>
  }>>([])

  // Universe positions - scattered across cosmic space
  const universePositions = [
    { x: '25%', y: '35%' },  // Quantum - upper left
    { x: '75%', y: '25%' },  // Ocean - upper right
    { x: '20%', y: '75%' },  // Fire - lower left
    { x: '80%', y: '70%' },  // Crystal - lower right
    { x: '50%', y: '50%' },  // Garden - center
    { x: '85%', y: '45%' },  // Music - right center
    { x: '35%', y: '85%' }   // Dream - lower center
  ]

  // Convert percentage positions to pixel positions
  const getUniversePosition = (index: number) => {
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1600
    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 900
    
    const pos = universePositions[index]
    return {
      x: (parseFloat(pos.x) / 100) * screenWidth,
      y: (parseFloat(pos.y) / 100) * screenHeight
    }
  }

  // Create realistic starfield
  useEffect(() => {
    const newStars = []
    for (let i = 0; i < 800; i++) {
      newStars.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 3 + 1
      })
    }
    setStars(newStars)
  }, [])

  // Create cosmic dust and nebula particles
  useEffect(() => {
    const particles = []
    for (let i = 0; i < 200; i++) {
      particles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 8 + 2,
        opacity: Math.random() * 0.3 + 0.1,
        color: ['#4c1d95', '#1e3a8a', '#7c2d12', '#831843', '#1f2937'][Math.floor(Math.random() * 5)]
      })
    }
    setCosmicDust(particles)
  }, [])

  // Animate cosmic dust
  useEffect(() => {
    const interval = setInterval(() => {
      setCosmicDust(prev => 
        prev.map(p => ({
          ...p,
          x: (p.x + p.vx + window.innerWidth) % window.innerWidth,
          y: (p.y + p.vy + window.innerHeight) % window.innerHeight,
        }))
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Create gravitational particle streams between planets
  useEffect(() => {
    const streams: Array<{
      id: number
      fromPlanet: number
      toPlanet: number
      particles: Array<{
        x: number
        y: number
        progress: number
        color: string
        size: number
      }>
    }> = []
    
    // Create connections between nearby planets
    const connections = [
      { from: 0, to: 1 }, // Quantum to Ocean
      { from: 1, to: 3 }, // Ocean to Crystal
      { from: 2, to: 4 }, // Fire to Garden
      { from: 4, to: 0 }, // Garden to Quantum
      { from: 3, to: 5 }, // Crystal to Music
      { from: 5, to: 6 }, // Music to Dream
      { from: 6, to: 2 }, // Dream to Fire
    ]
    
    connections.forEach((conn, idx) => {
      const particles = []
      for (let i = 0; i < 12; i++) {
        particles.push({
          x: 0,
          y: 0,
          progress: (i / 12) + Math.random() * 0.1,
          color: universes[conn.from].colors[0],
          size: Math.random() * 2 + 1
        })
      }
      
      streams.push({
        id: idx,
        fromPlanet: conn.from,
        toPlanet: conn.to,
        particles
      })
    })
    
    setGravitationalStreams(streams)
  }, [])

  // Keep gravitational streams static - no animation
  // Removed animation loop for static universe

  const handleUniverseClick = (universe: UniverseData) => {
    setSelectedUniverse(universe)
  }

  const closeModal = () => {
    setSelectedUniverse(null)
  }

  const renderPlanet = (universe: UniverseData, x: number, y: number) => {
    const getPlanetStyle = () => {
      switch (universe.planetType) {
        case 'gas-giant':
          return {
            background: `radial-gradient(circle at 30% 30%, ${universe.colors[1]}, ${universe.colors[0]}, ${universe.colors[2]})`,
            boxShadow: `0 0 50px ${universe.colors[0]}, inset -20px -20px 50px rgba(0,0,0,0.3)`,
            border: `2px solid ${universe.colors[1]}20`
          }
        case 'lava':
          return {
            background: `radial-gradient(circle at 30% 30%, ${universe.colors[1]}, ${universe.colors[0]}, #000000)`,
            boxShadow: `0 0 80px ${universe.colors[0]}, inset -15px -15px 30px rgba(0,0,0,0.5)`,
            animation: 'lavaGlow 3s ease-in-out infinite alternate'
          }
        case 'ice':
          return {
            background: `radial-gradient(circle at 40% 40%, #ffffff, ${universe.colors[0]}, ${universe.colors[2]})`,
            boxShadow: `0 0 60px ${universe.colors[1]}, inset -10px -10px 20px rgba(255,255,255,0.1)`,
            border: `1px solid ${universe.colors[1]}40`
          }
        case 'forest':
          return {
            background: `radial-gradient(circle at 35% 35%, ${universe.colors[1]}, ${universe.colors[0]}, ${universe.colors[2]})`,
            boxShadow: `0 0 40px ${universe.colors[0]}, inset -15px -15px 40px rgba(0,0,0,0.2)`,
            border: `1px solid ${universe.colors[1]}30`
          }
        case 'crystal':
          return {
            background: `conic-gradient(${universe.colors[0]}, ${universe.colors[1]}, ${universe.colors[2]}, ${universe.colors[0]})`,
            boxShadow: `0 0 100px ${universe.colors[1]}, inset 5px 5px 20px rgba(255,255,255,0.2)`,
            animation: 'crystalShimmer 4s linear infinite'
          }
        case 'nebula':
          return {
            background: `radial-gradient(circle, transparent 20%, ${universe.colors[0]}40 40%, ${universe.colors[1]}20 60%, transparent 80%)`,
            boxShadow: `0 0 120px ${universe.colors[0]}, 0 0 200px ${universe.colors[1]}`,
            filter: 'blur(2px)',
            animation: 'nebulaPulse 6s ease-in-out infinite'
          }
        case 'rocky':
          return {
            background: `radial-gradient(circle at 35% 35%, ${universe.colors[1]}, ${universe.colors[0]}, ${universe.colors[2]})`,
            boxShadow: `0 0 30px ${universe.colors[0]}, inset -10px -10px 25px rgba(0,0,0,0.4)`,
            border: `1px solid ${universe.colors[1]}20`
          }
        default:
          return {
            background: `radial-gradient(circle at 30% 30%, ${universe.colors[1]}, ${universe.colors[0]})`,
            boxShadow: `0 0 50px ${universe.colors[0]}`
          }
      }
    }

    return (
      <div
        className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 group"
        style={{ left: x, top: y }}
        onClick={() => handleUniverseClick(universe)}
      >
        {/* Planet */}
        <div
          className="rounded-full relative overflow-hidden"
          style={{
            width: universe.size,
            height: universe.size,
            ...getPlanetStyle()
          }}
        >
          {/* Planet surface details */}
          {universe.planetType === 'gas-giant' && (
            <div className="absolute inset-0">
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="absolute w-full opacity-30"
                  style={{
                    height: '8px',
                    top: `${20 + i * 20}%`,
                    background: `linear-gradient(90deg, transparent, ${universe.colors[i % 3]}80, transparent)`,
                    animation: `gasFlow ${3 + i}s linear infinite`
                  }}
                />
              ))}
            </div>
          )}

          {/* Planetary rings */}
          {universe.hasRings && (
            <>
              <div
                className="absolute border-2 rounded-full opacity-60"
                style={{
                  width: universe.size * 1.8,
                  height: universe.size * 0.3,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%) rotateX(75deg)',
                  borderColor: `${universe.colors[1]}60`,
                  borderTop: 'none',
                  borderBottom: 'none'
                }}
              />
              <div
                className="absolute border-2 rounded-full opacity-40"
                style={{
                  width: universe.size * 2.1,
                  height: universe.size * 0.35,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%) rotateX(75deg)',
                  borderColor: `${universe.colors[2]}40`,
                  borderTop: 'none',
                  borderBottom: 'none'
                }}
              />
            </>
          )}
        </div>

        {/* Moons */}
        {universe.moons && universe.moons > 0 && (
          <>
            {Array.from({ length: universe.moons || 0 }, (_, i) => {
              const moonAngle = (i * 2 * Math.PI) / universe.moons
              const moonDistance = universe.size * 0.8 + i * 10
              const moonX = Math.cos(moonAngle) * moonDistance
              const moonY = Math.sin(moonAngle) * moonDistance
              
              return (
                <div
                  key={`moon-${i}`}
                  className="absolute rounded-full"
                  style={{
                    left: moonX,
                    top: moonY,
                    width: 8 + i * 2,
                    height: 8 + i * 2,
                    backgroundColor: '#e5e7eb',
                    boxShadow: '0 0 10px rgba(255,255,255,0.5), inset -2px -2px 5px rgba(0,0,0,0.3)',
                    transform: 'translate(-50%, -50%)',
                    animation: `orbit${i} ${8 + i * 2}s linear infinite`
                  }}
                />
              )
            })}
          </>
        )}

        {/* Planet label on hover */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-white text-sm text-center whitespace-nowrap bg-black bg-opacity-50 px-2 py-1 rounded">
            {universe.title.replace('In the ', '').replace(' Universe', '')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      {/* Deep space background - side view perspective */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, #000814 0%, #001d3d 30%, #003566 70%, #000000 100%)',
        }}
      />
      
      {/* Milky Way band across the background */}
      <div 
        className="absolute w-full h-32 opacity-20"
        style={{
          top: '40%',
          background: 'linear-gradient(180deg, transparent 0%, #8b5cf640 20%, #ffffff20 50%, #8b5cf640 80%, transparent 100%)',
          filter: 'blur(20px)'
        }}
      />

      {/* Starfield */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: star.x,
            top: star.y,
            width: star.size,
            height: star.size,
            backgroundColor: '#ffffff',
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 2}px rgba(255,255,255,0.8)`,
            animation: `starTwinkle ${star.twinkleSpeed}s ease-in-out infinite alternate`
          }}
        />
      ))}

      {/* Cosmic dust and nebula */}
      {cosmicDust.map(dust => (
        <div
          key={dust.id}
          className="absolute rounded-full"
          style={{
            left: dust.x,
            top: dust.y,
            width: dust.size,
            height: dust.size,
            backgroundColor: dust.color,
            opacity: dust.opacity,
            filter: 'blur(3px)',
            animation: 'cosmicDrift 20s linear infinite'
          }}
        />
      ))}

      {/* Distant galaxies */}
      <div className="absolute top-10 right-20 w-32 h-32 opacity-20">
        <div 
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, #8b5cf6 20%, transparent 70%)',
            filter: 'blur(8px)',
            animation: 'galaxyRotate 60s linear infinite'
          }}
        />
      </div>
      
      <div className="absolute bottom-20 left-10 w-24 h-24 opacity-15">
        <div 
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, #06b6d4 20%, transparent 70%)',
            filter: 'blur(6px)',
            animation: 'galaxyRotate 90s linear infinite reverse'
          }}
        />
      </div>

      {/* Gravitational Streams */}
      {gravitationalStreams.map(stream => {
        const fromPos = getUniversePosition(stream.fromPlanet)
        const toPos = getUniversePosition(stream.toPlanet)
        
        return (
          <div key={`stream-${stream.id}`}>
            {/* Connection line */}
            <svg 
              className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30"
              style={{ zIndex: 1 }}
            >
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={stream.particles[0]?.color || '#ffffff'}
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.3"
              />
            </svg>
            
            {/* Flowing particles */}
            {stream.particles.map((particle, pIndex) => {
              const x = fromPos.x + (toPos.x - fromPos.x) * particle.progress
              const y = fromPos.y + (toPos.y - fromPos.y) * particle.progress
              
              return (
                <div
                  key={`particle-${stream.id}-${pIndex}`}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    left: x - particle.size/2,
                    top: y - particle.size/2,
                    width: particle.size,
                    height: particle.size,
                    backgroundColor: particle.color,
                    boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                    opacity: 0.8,
                    zIndex: 2
                  }}
                />
              )
            })}
          </div>
        )
      })}

      {/* Title */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center z-20">
        <h1 
          className="text-5xl font-bold text-white mb-4 drop-shadow-2xl"
          style={{ 
            fontFamily: 'Dancing Script, cursive',
            textShadow: '0 0 20px rgba(255,255,255,0.5)'
          }}
        >
          I Love You In Every Universe
        </h1>
        <p 
          className="text-xl text-gray-300"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Click on each world to discover how much I love you ✨
        </p>
      </div>

      {/* Universe Planets Scattered */}
      <div className="absolute inset-0">
        {universes.map((universe, index) => {
          const position = getUniversePosition(index)
          return (
            <div key={universe.id} style={{ position: 'absolute' }}>
              {renderPlanet(universe, position.x, position.y)}
            </div>
          )
        })}
      </div>

      {/* Modal for selected universe */}
      {selectedUniverse && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div 
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 max-w-lg mx-4 text-center relative border border-gray-700"
            style={{ 
              boxShadow: `0 0 100px ${selectedUniverse.colors[0]}, inset 0 0 50px rgba(0,0,0,0.8)`,
              backdropFilter: 'blur(10px)'
            }}
          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            
            <h2 
              className="text-3xl font-bold text-white mb-6"
              style={{ 
                fontFamily: 'Dancing Script, cursive',
                textShadow: `0 0 20px ${selectedUniverse.colors[0]}`
              }}
            >
              {selectedUniverse.title}
            </h2>
            
            <p 
              className="text-gray-300 text-lg leading-relaxed"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {selectedUniverse.message}
            </p>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes starTwinkle {
          0% { opacity: 0.3; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes cosmicDrift {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(360deg); }
        }
        
        @keyframes galaxyRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes lavaGlow {
          0% { box-shadow: 0 0 80px ${universes[2]?.colors[0]}, inset -15px -15px 30px rgba(0,0,0,0.5); }
          100% { box-shadow: 0 0 120px ${universes[2]?.colors[1]}, inset -15px -15px 30px rgba(0,0,0,0.3); }
        }
        
        @keyframes crystalShimmer {
          0% { filter: hue-rotate(0deg) brightness(1); }
          25% { filter: hue-rotate(90deg) brightness(1.2); }
          50% { filter: hue-rotate(180deg) brightness(1); }
          75% { filter: hue-rotate(270deg) brightness(1.2); }
          100% { filter: hue-rotate(360deg) brightness(1); }
        }
        
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes gasFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes nebulaPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.1); }
        }
        
        @keyframes galaxyRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        ${universes.map((universe) => 
          Array.from({ length: universe.moons || 0 }, (_, moonIndex) => `
            @keyframes orbit${moonIndex} {
              0% { transform: translate(-50%, -50%) rotate(0deg) translateX(${universe.size * 0.8 + moonIndex * 10}px) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg) translateX(${universe.size * 0.8 + moonIndex * 10}px) rotate(-360deg); }
            }
          `).join('')
        ).join('')}
      `}</style>
    </div>
  )
}