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
    
    // 分类色板 - 红金橙系为主
    const colorPalettes = {
      classic: [
        // 金色系
        '#FFD700', '#FFC700', '#FFBB00',
        // 红色系
        '#FF4500', '#FF6347', '#FF5722', '#DC143C', '#E63946',
        // 橙色系
        '#FF8C00', '#FF7F00', '#FFA500',
        // 亮色点缀
        '#FFEB3B', '#FFE082', '#FFD54F'
      ],
      celestial: [
        // 明亮的金铜色
        '#FFEAA7', '#FFD93D', '#F39C12',
        // 深红色
        '#BD3039', '#C0392B', '#D42426',
        // 橙红色
        '#E54B2B', '#FF7043', '#FF8A50'
      ],
      warm: [
        // 暖金色
        '#FDD835', '#FBC02D', '#FFB300',
        // 热红色
        '#FF6F00', '#FF5722', '#E64A19',
        // 火焰色
        '#FFAB40', '#FFA726', '#FB8C00'
      ]
    }

    // 根据浏览器窗口宽度随机选择色板（保持一致性但有变化）
    const paletteIndex = Math.floor(window.innerWidth / 300) % Object.keys(colorPalettes).length
    const selectedPalette = Object.values(colorPalettes)[paletteIndex]

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
        
        // 烟雾粒子更小，主要粒子有尺寸变化
        if (color.includes('rgba')) {
          this.size = 1 + Math.random() * 2 // 烟雾粒子更小
        } else {
          // 主粒子尺寸分布更自然：更多小粒子，少数大粒子
          const sizeRandom = Math.random()
          if (sizeRandom < 0.7) {
            this.size = 1 + Math.random() * 3 // 70% 小粒子
          } else {
            this.size = 3 + Math.random() * 5 // 30% 中大粒子
          }
        }
        
        this.gravity = type === FireworkType.TRAIL ? 0.15 : 0.06 + Math.random() * 0.05
      }

      draw() {
        ctx!.save()
        ctx!.globalAlpha = this.alpha
        ctx!.fillStyle = this.color
        
        // 是否为烟雾粒子
        const isSmoke = this.color.includes('rgba')
        
        // 不同类型的视觉效果
        if (isSmoke) {
          // 烟雾无光晕
          ctx!.shadowBlur = 0
        } else if (this.type === FireworkType.TRAIL) {
          // 流星有强烈发光效果
          ctx!.shadowColor = this.color
          ctx!.shadowBlur = 15
          ctx!.shadowOffsetX = 0
          ctx!.shadowOffsetY = 0
        } else if (this.type === FireworkType.SCATTER) {
          // 散射星火有轻微发光
          ctx!.shadowColor = this.color
          ctx!.shadowBlur = 6
        } else {
          // 正常爆炸效果 - 金红色系有更强的辉光
          ctx!.shadowColor = this.color
          ctx!.shadowBlur = 10
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
          burstCount = 200 + Math.floor(Math.random() * 130)
          break
        case FireworkType.RING:
          burstCount = 120 + Math.floor(Math.random() * 90)
          break
        case FireworkType.TRAIL:
          burstCount = 150 + Math.floor(Math.random() * 120)
          break
        case FireworkType.SCATTER:
          burstCount = 300 + Math.floor(Math.random() * 200)
          break
      }
      
      for (let i = 0; i < burstCount; i++) {
        // 核心粒子用选中的色板，外围粒子混入烟雾效果
        let color: string
        if (Math.random() < 0.12) {
          // 12% 概率使用烟雾效果（白色/灰色）
          color = ['rgba(255,255,255,0.4)', 'rgba(255,255,200,0.35)', 'rgba(255,234,167,0.3)'][
            Math.floor(Math.random() * 3)
          ]
        } else {
          // 88% 使用选中的色板
          color = selectedPalette[Math.floor(Math.random() * selectedPalette.length)]
        }
        particles.push(new Particle(posX, posY, color, type))
      }
      
      // 添加额外的小型烟雾粒子，增加逼真感和密度
      const smokeCount = burstCount * 0.35
      for (let i = 0; i < smokeCount; i++) {
        particles.push(new Particle(posX, posY, 'rgba(255,255,255,0.15)', type))
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
