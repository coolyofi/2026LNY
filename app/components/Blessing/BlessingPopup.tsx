'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrayerStore } from '../../../lib/store'
import { findBlessing } from '../../../lib/blessings'
import Fireworks from '../Fireworks/Fireworks'

interface CardPosition {
  top: string
  left: string
  right?: string
}

export default function BlessingPopup() {
  const count = usePrayerStore((s: any) => s.count)
  const [visible, setVisible] = useState(false)
  const [blessing, setBlessing] = useState<any | null>(null)
  const [position, setPosition] = useState<CardPosition>({ top: '20%', left: '10%' })
  const lastShown = useRef<number | null>(null)

  useEffect(() => {
    const b = findBlessing(count)
    if (!b) return
    if (lastShown.current === b.count) return

    lastShown.current = b.count
    setBlessing(b)
    setVisible(true)

    // 随机位置：上下左右四个角落和边缘
    const positions: CardPosition[] = [
      { top: '15%', left: '8%' },
      { top: '15%', right: '8%', left: 'auto' },
      { top: '65%', left: '8%' },
      { top: '65%', right: '8%', left: 'auto' },
      { top: '35%', left: '5%' },
      { top: '35%', right: '5%', left: 'auto' },
    ]
    setPosition(positions[Math.floor(Math.random() * positions.length)])

    const t = setTimeout(() => setVisible(false), 2800)
    return () => clearTimeout(t)
  }, [count])

  return (
    <AnimatePresence>
      {visible && blessing && (
        <>
          <Fireworks />
          <motion.div
            key={`blessing-${blessing.count}`}
            initial={{ opacity: 0, scale: 0.3, rotate: -8, y: 30 }}
            animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.2, rotate: 8, y: -50 }}
            transition={{ 
              type: 'spring',
              stiffness: 200,
              damping: 15,
              duration: 0.6
            }}
            className="fixed pointer-events-none z-50"
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
              width: 'clamp(280px, 90vw, 360px)',
            }}
          >
            {/* 装饰性背景光晕 */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/20 to-red-400/20 blur-2xl rounded-3xl" />

            {/* 贺卡主体 */}
            <div className="relative bg-gradient-to-br from-amber-50 via-red-50 to-amber-100 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-200/50">
              
              {/* 顶部装饰条纹 */}
              <div className="h-1 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"></div>

              {/* 内容区域 */}
              <div className="p-5 md:p-6 text-center relative">
                
                {/* 装饰角落 */}
                <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-amber-300/60"></div>
                <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-amber-300/60"></div>

                {/* 里程碑数字徽章 */}
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block mb-2"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {blessing.count}
                  </div>
                </motion.div>

                {/* 标题 */}
                <h3 className="text-xl md:text-2xl font-bold mb-2" style={{ 
                  fontFamily: "'STKaiti', 'KaiTi', serif",
                  background: 'linear-gradient(135deg, #d97706, #b91c1c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {blessing.title}
                </h3>

                {/* 祝福文案 */}
                <p className="text-sm md:text-base leading-relaxed text-gray-700 mb-3 whitespace-pre-wrap max-h-24 overflow-hidden blessing-serif">
                  {blessing.message}
                </p>

                {/* 底部装饰 */}
                <div className="flex justify-center gap-2 mb-2">
                  <span className="text-lg">🎊</span>
                  <span className="text-lg">✨</span>
                  <span className="text-lg">🎊</span>
                </div>

                {/* 次级文本 */}
                <motion.p 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs md:text-sm text-amber-700/70 italic"
                >
                  里程碑已达成
                </motion.p>
              </div>

              {/* 底部装饰条纹 */}
              <div className="h-1 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
