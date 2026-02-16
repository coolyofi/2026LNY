'use client'

import { useEffect, useRef } from 'react'

interface FireworksProps {
  x?: number
  y?: number
  trigger?: number
}

export default function Fireworks({ x, y, trigger }: FireworksProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: any[] = []
    const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#FF69B4', '#FFFF00', '#FF8C00']

    // 烟花类型枚举
    enum FireworkType {
      BURST = 'burst',        // 圆形喷射爆炸
      RING = 'ring',          // 环形展开
      TRAIL = 'trail',        // 拖尾流星
      SCATTER = 'scatter'     // 散射星火
    }

    class Particle {
      x: number; y: number; vx: number; vy: number; alpha: number; color: string; life: number; size: number; gravity: number; type: string
      constructor(x: number, y: number, color: string, type: FireworkType = FireworkType.BURST) {
        this.x = x
        this.y = y
        this.color = color
        this.type = type

        // 根据烟花类型设置不同的粒子运动特性
        const angle = Math.random() * Math.PI * 2
        let speed = 0

        switch (type) {
          case FireworkType.BURST:
            // 圆形爆炸 - 各向均匀
            speed = 5 + Math.random() * 8
            break
          case FireworkType.RING:
            // 环形展开 - 均匀向外
            speed = 4 + Math.random() * 5
            break
          case FireworkType.TRAIL:
            // 拖尾流星 - 快速向上+随机方向
            speed = 6 + Math.random() * 8
            break
          case FireworkType.SCATTER:
            // 散射星火 - 低速多向
            speed = 2 + Math.random() * 5
            break
        }

        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.alpha = 1
        this.life = 0.93 + Math.random() * 0.06
        this.size = 2 + Math.random() * 4
        this.gravity = type === FireworkType.TRAIL ? 0.15 : 0.06 + Math.random() * 0.05
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.alpha
        ctx!.fillStyle = this.color
        
        // 不同类型的视觉效果
        if (this.type === FireworkType.TRAIL) {
          // 流星有发光效果
          ctx!.shadowColor = this.color
          ctx!.shadowBlur = 12
        } else if (this.type === FireworkType.SCATTER) {
          // 散射星火有轻微发光
          ctx!.shadowColor = this.color
          ctx!.shadowBlur = 4
        } else {
          // 正常爆炸效果
          ctx!.shadowColor = this.color
          ctx!.shadowBlur = 8
        }
        
        ctx!.beginPath()
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx!.fill()
        ctx!.restore()
      }

      update() {
        this.x += this.vx
        this.y += this.vy
        this.vy += this.gravity
        this.vx *= 0.985 // 空气阻力
        this.alpha *= this.life
        this.size *= 0.97
      }
    }

    const createExplosion = (posX: number, posY: number, type: FireworkType = FireworkType.BURST) => {
      let burstCount = 0
      
      switch (type) {
        case FireworkType.BURST:
          burstCount = 150 + Math.floor(Math.random() * 100)
          break
        case FireworkType.RING:
          burstCount = 80 + Math.floor(Math.random() * 60)
          break
        case FireworkType.TRAIL:
          burstCount = 100 + Math.floor(Math.random() * 80)
          break
        case FireworkType.SCATTER:
          burstCount = 200 + Math.floor(Math.random() * 150)
          break
      }
      
      for (let i = 0; i < burstCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)]
        particles.push(new Particle(posX, posY, color, type))
      }
    }

    // 如果有外部触发，执行不同的烟花模式
    if (trigger !== undefined && trigger > 0) {
      const centerX = x ?? canvas.width / 2
      const centerY = y ?? canvas.height / 2
      
      // 随机选择烟花类型
      const fireworkTypes = [FireworkType.BURST, FireworkType.RING, FireworkType.TRAIL, FireworkType.SCATTER]
      const selectedType = fireworkTypes[Math.floor(Math.random() * fireworkTypes.length)]
      
      createExplosion(centerX, centerY, selectedType)
    }

    let animationFrameId: number

    function animate() {
      if (!canvas || !ctx) return

      // 清空画布而不是累积黑色
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 更新和绘制粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update()
        particles[i].draw()
        if (particles[i].alpha < 0.01) {
          particles.splice(i, 1)
        }
      }

      // 只在有粒子时继续动画
      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate)
      }
    }
    
    animate()

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      cancelAnimationFrame(animationFrameId)
    }
  }, [trigger, x, y])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}
