'use client'

import { useEffect, useRef } from 'react'

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    const colors = ['#FFD700', '#FF4500', '#FF1493', '#00FF7F', '#1E90FF', '#FFFF00']

    class Particle {
      x: number; y: number; vx: number; vy: number; alpha: number; color: string; life: number;
      constructor(x: number, y: number, color: string) {
        this.x = x; this.y = y; this.color = color;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.alpha = 1; this.life = 0.95 + Math.random() * 0.05;
      }
      draw() {
        ctx!.save(); ctx!.globalAlpha = this.alpha;
        ctx!.fillStyle = this.color; ctx!.beginPath();
        ctx!.arc(this.x, this.y, 3, 0, Math.PI * 2); ctx!.fill();
        ctx!.restore();
      }
      update() {
        this.x += this.vx; this.y += this.vy; this.vy += 0.1;
        this.alpha *= this.life;
      }
    }

    const createExplosion = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color))
      }
    }

    // Initial bursts
    for(let i=0; i<5; i++) {
        setTimeout(() => createExplosion(Math.random() * canvas.width, Math.random() * canvas.height * 0.5), i * 300)
    }

    function animate() {
      ctx!.fillStyle = 'rgba(0,0,0,0.1)';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha < 0.01) particles.splice(i, 1);
      }
      
      if (particles.length > 0) {
        requestAnimationFrame(animate)
      }
    }
    animate()

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}
