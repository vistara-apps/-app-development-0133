import React, { useEffect, useRef, useState } from 'react'

export function Confetti({ 
  active = false, 
  duration = 3000,
  particleCount = 100,
  colors = ['#1E88E5', '#43A047', '#FFB300', '#E53935', '#5E35B1', '#00ACC1'],
  onComplete
}) {
  const canvasRef = useRef(null)
  const [particles, setParticles] = useState([])
  const animationRef = useRef(null)
  const timerRef = useRef(null)
  
  // Create particles when active changes to true
  useEffect(() => {
    if (active && canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      const width = canvas.width = window.innerWidth
      const height = canvas.height = window.innerHeight
      
      // Create particles
      const newParticles = []
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          size: Math.random() * 10 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          speed: Math.random() * 3 + 2,
          rotationSpeed: Math.random() * 2 - 1,
          oscillationSpeed: Math.random() * 2 + 1,
          oscillationDistance: Math.random() * 5 + 5,
          initialX: 0
        })
      }
      
      setParticles(newParticles)
      
      // Set timer to stop animation
      timerRef.current = setTimeout(() => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
        
        if (onComplete) {
          onComplete()
        }
      }, duration)
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [active, particleCount, colors, duration, onComplete])
  
  // Animation loop
  useEffect(() => {
    if (!active || particles.length === 0 || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    
    let animationStartTime = null
    
    const animate = (timestamp) => {
      if (!animationStartTime) animationStartTime = timestamp
      const progress = timestamp - animationStartTime
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Update and draw particles
      const updatedParticles = [...particles]
      let allParticlesOffscreen = true
      
      for (let i = 0; i < updatedParticles.length; i++) {
        const p = updatedParticles[i]
        
        // Initialize initialX if not set
        if (p.initialX === 0) {
          p.initialX = p.x
        }
        
        // Update position
        p.y += p.speed
        p.x = p.initialX + Math.sin(progress * 0.001 * p.oscillationSpeed) * p.oscillationDistance
        p.rotation += p.rotationSpeed
        
        // Check if any particle is still on screen
        if (p.y < height) {
          allParticlesOffscreen = false
        }
        
        // Draw particle (simple rectangle for performance)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
        ctx.restore()
      }
      
      // Stop animation if all particles are off screen
      if (allParticlesOffscreen) {
        if (onComplete) {
          onComplete()
        }
        return
      }
      
      // Continue animation
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, particles, onComplete])
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  if (!active) return null
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  )
}

