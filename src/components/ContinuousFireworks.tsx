import { useState, useEffect } from 'react'

export default function ContinuousFireworks() {
  const [fireworks, setFireworks] = useState<Array<{
    id: number
    x: number
    y: number
    particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      opacity: number
      size: number
      maxOpacity: number
    }>
    type: 'chrysanthemum' | 'willow' | 'peony' | 'palm' | 'crossette' | 'shooting-star'
    phase?: 'traveling' | 'exploding'
    targetX?: number
    targetY?: number
    startX?: number
    startY?: number
    travelProgress?: number
  }>>([])
  
  // Create a shooting star firework - ALL fireworks are now shooting stars
  const createFirework = () => {
    const types = ['chrysanthemum', 'willow', 'peony', 'palm', 'crossette'] as const
    const type = types[Math.floor(Math.random() * types.length)]
    
    // ALL fireworks are shooting stars now - start from bottom and travel vertically
    const startX = Math.random() * window.innerWidth
    const startY = window.innerHeight + 50  // Start below screen
    
    // Target explosion point - straight up from launch position (vertical)
    const targetX = startX + (Math.random() - 0.5) * 100  // Slight horizontal drift
    const targetY = Math.random() * (window.innerHeight * 0.4) + 50  // Upper portion of screen
    
    const x = startX
    const y = startY
    const phase = 'traveling'
    
    const colorSets = [
      ['#ff69b4', '#ff8fab', '#ffb3c6'], // Pink gradient
      ['#00ffff', '#4dffff', '#99ffff'], // Cyan gradient  
      ['#ffd700', '#ffe066', '#ffeb99'], // Gold gradient
      ['#ff6b6b', '#ff8a8a', '#ffa8a8'], // Red gradient
      ['#4ecdc4', '#7dd6ce', '#abe0d8'], // Teal gradient
      ['#45b7d1', '#74c7dd', '#a3d7e9'], // Blue gradient
      ['#ff9ff3', '#ffb3f6', '#ffc6f9'], // Purple gradient
      ['#54a0ff', '#7bb3ff', '#a2c6ff']  // Light blue gradient
    ]
    const colors = colorSets[Math.floor(Math.random() * colorSets.length)]
    
    // All fireworks start as shooting stars with trail particles
    const particles = createShootingStarParticles(x, y, colors)
    
    const newFirework = {
      id: Date.now() + Math.random(),
      x,
      y,
      particles,
      type,
      phase,
      targetX,
      targetY,
      startX,
      startY,
      travelProgress: 0
    }
    
    setFireworks(prev => [...prev, newFirework])
  }

  // Create shooting star trail particles - vertical trail
  const createShootingStarParticles = (x: number, y: number, colors: string[]) => {
    const particles = []
    
    // Main shooting star particle (bright head)
    particles.push({
      x,
      y,
      vx: 0,
      vy: 0,
      color: colors[0],
      opacity: 1,
      size: 10,
      maxOpacity: 1
    })
    
    // Vertical trail particles behind the main particle
    for (let i = 1; i <= 12; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 3, // Slight horizontal randomness
        y: y + (i * 6), // Vertical trail going down (since rocket moves up)
        vx: 0,
        vy: 0,
        color: colors[i % colors.length],
        opacity: Math.max(0.1, 1 - (i * 0.08)),
        size: Math.max(2, 9 - (i * 0.6)),
        maxOpacity: Math.max(0.1, 1 - (i * 0.08))
      })
    }
    
    return particles
  }

  // Create different explosion patterns
  const createExplosionParticles = (type: string, x: number, y: number, colors: string[]) => {
    const particles = []
    const particleCount = type === 'chrysanthemum' ? 60 : 
                        type === 'willow' ? 45 : 
                        type === 'palm' ? 30 : 50
    
    for (let i = 0; i < particleCount; i++) {
      let vx, vy, color, size, maxOpacity
      
      switch (type) {
        case 'chrysanthemum':
          // Perfect sphere pattern
          const angle = (Math.PI * 2 * i) / particleCount
          const radius = 4 + Math.random() * 3
          vx = Math.cos(angle) * radius
          vy = Math.sin(angle) * radius
          color = colors[i % colors.length]
          size = 4 + Math.random() * 4
          maxOpacity = 1
          break
          
        case 'willow':
          // Drooping willow effect
          const wAngle = (Math.PI * 2 * i) / particleCount
          const wRadius = 3 + Math.random() * 2
          vx = Math.cos(wAngle) * wRadius
          vy = Math.sin(wAngle) * wRadius - 1 // Slight downward bias
          color = colors[Math.floor(i / (particleCount / colors.length))]
          size = 3 + Math.random() * 3
          maxOpacity = 0.9
          break
          
        case 'peony':
          // Dense, round burst
          const pAngle = Math.random() * Math.PI * 2
          const pRadius = Math.random() * 4 + 2
          vx = Math.cos(pAngle) * pRadius
          vy = Math.sin(pAngle) * pRadius
          color = colors[0] // Single color
          size = 5 + Math.random() * 3
          maxOpacity = 1
          break
          
        case 'palm':
          // Few large streaks going up
          const palmAngle = (Math.PI * 2 * i) / particleCount
          const palmRadius = 3 + Math.random() * 4
          vx = Math.cos(palmAngle) * palmRadius * 0.7
          vy = Math.sin(palmAngle) * palmRadius - 2 // Strong upward bias
          color = colors[i % 2] // Alternating colors
          size = 6 + Math.random() * 4
          maxOpacity = 1
          break
          
        case 'crossette':
          // Multiple smaller bursts
          const cAngle = (Math.PI * 2 * i) / (particleCount / 5)
          const cRadius = 2 + Math.random() * 3
          vx = Math.cos(cAngle) * cRadius
          vy = Math.sin(cAngle) * cRadius
          color = colors[Math.floor(i / 8) % colors.length]
          size = 3 + Math.random() * 2
          maxOpacity = 0.8
          break
          
        default:
          vx = (Math.random() - 0.5) * 8
          vy = (Math.random() - 0.5) * 8
          color = colors[0]
          size = 4
          maxOpacity = 1
      }
      
      particles.push({
        x,
        y,
        vx,
        vy,
        color,
        opacity: maxOpacity,
        size,
        maxOpacity
      })
    }
    
    return particles
  }

  // Animate firework particles
  useEffect(() => {
    const interval = setInterval(() => {
      setFireworks(prev => 
        prev.map(firework => {
          if (firework.phase === 'traveling') {
            // Animate shooting star movement
            const travelProgress = (firework.travelProgress || 0) + 0.008
            
            if (travelProgress >= 1) {
              // Reached target - explode!
              const explosionParticles = createExplosionParticles('chrysanthemum', firework.targetX!, firework.targetY!, ['#ff69b4', '#ff8fab', '#ffb3c6'])
              return {
                ...firework,
                phase: 'exploding',
                x: firework.targetX!,
                y: firework.targetY!,
                particles: explosionParticles,
                travelProgress: 1
              }
            }
            
            // Interpolate position
            const currentX = firework.startX! + (firework.targetX! - firework.startX!) * travelProgress
            const currentY = firework.startY! + (firework.targetY! - firework.startY!) * travelProgress
            
            // Update shooting star trail particles
            const newParticles = firework.particles.map((p, index) => {
              if (index === 0) {
                // Main particle follows the path
                return {
                  ...p,
                  x: currentX,
                  y: currentY
                }
              } else {
                // Trail particles follow behind with delay
                const trailDelay = index * 0.03
                const trailProgress = Math.max(0, travelProgress - trailDelay)
                const trailX = firework.startX! + (firework.targetX! - firework.startX!) * trailProgress
                const trailY = firework.startY! + (firework.targetY! - firework.startY!) * trailProgress
                
                return {
                  ...p,
                  x: trailX,
                  y: trailY,
                  opacity: p.maxOpacity * Math.max(0.1, 1 - trailProgress * 0.5) // fade as it travels
                }
              }
            })
            
            return {
              ...firework,
              x: currentX,
              y: currentY,
              particles: newParticles,
              travelProgress
            }
          } else {
            // Animate explosion particles (regular fireworks or exploding shooting star)
            const newParticles = firework.particles.map(p => {
              const gravityMultiplier = firework.type === 'willow' ? 1.5 : 
                                      firework.type === 'palm' ? 0.5 : 1.0
              
              return {
                ...p,
                x: p.x + p.vx,
                y: p.y + p.vy,
                vx: p.vx * 0.985, // air resistance
                vy: p.vy + (0.15 * gravityMultiplier), // gravity
                opacity: p.opacity - 0.015,
                size: p.size * 0.99
              }
            }).filter(p => p.opacity > 0)
            
            return {
              ...firework,
              particles: newParticles
            }
          }
        }).filter(firework => firework.particles.length > 0)
      )
    }, 12)

    return () => clearInterval(interval)
  }, [])

  // Launch fireworks continuously
  useEffect(() => {
    const launchFirework = () => {
      createFirework()
      // Sometimes launch multiple fireworks
      if (Math.random() > 0.7) {
        setTimeout(() => createFirework(), 300)
      }
    }
    
    // Launch initial firework
    launchFirework()
    
    // Continue launching fireworks every 1-2 seconds
    const interval = setInterval(() => {
      launchFirework()
    }, 1000 + Math.random() * 1000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {fireworks.map(firework => (
        <div key={firework.id}>
          {/* Firework particles */}
          {firework.particles.map((particle, index) => (
            <div key={index}>
              {/* Main particle */}
              <div
                className="absolute rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              {/* Glow effect */}
              <div
                className="absolute rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size * 2,
                  height: particle.size * 2,
                  backgroundColor: particle.color,
                  opacity: particle.opacity * 0.3,
                  boxShadow: `0 0 ${particle.size * 3}px ${particle.color}`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(2px)'
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}