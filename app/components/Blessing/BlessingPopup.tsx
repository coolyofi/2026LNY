'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrayerStore } from '../../../lib/store'
import { nearestBlessingAtOrBelow, isImportantMilestone } from '../../../lib/blessings'

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
  const [isImportant, setIsImportant] = useState(false)
  const lastShown = useRef<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 初始化 lastShown 从 localStorage
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('lastShownBlessing') : null
    if (saved) {
      lastShown.current = parseInt(saved, 10)
    }
  }, [])

  // 解析祝福文案为祝福语和解释
  const parseMessage = (message: string) => {
    const match = message.match(/^(.*?。)(.*)$/)
    if (match) {
      return {
        blessing: match[1].trim(),
        explanation: match[2].trim()
      }
    }
    return {
      blessing: message,
      explanation: ''
    }
  }

  useEffect(() => {
    const b = nearestBlessingAtOrBelow(count)
    if (!b) return
    if (lastShown.current === b.count) return

    // 清理之前的 timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    lastShown.current = b.count
    // 保存到 localStorage，以便页面刷新后也能记忆
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastShownBlessing', b.count.toString())
    }
    
    const important = isImportantMilestone(b.count)
    setBlessing(b)
    setIsImportant(important)
    setVisible(true)

    if (!important) {
      const positions: CardPosition[] = [
        { top: '8%', left: '8%' },
        { top: '8%', right: '8%', left: 'auto' },
        { top: '80%', left: '8%' },
        { top: '80%', right: '8%', left: 'auto' },
      ]
      setPosition(positions[Math.floor(Math.random() * positions.length)])
    }

    // 重要里程碑显示4秒，非重要里程碑显示5秒
    const displayTime = important ? 4000 : 5000
    timeoutRef.current = setTimeout(() => {
      setVisible(false)
      timeoutRef.current = null
    }, displayTime)

    // 组件卸载或新的 blessing 出现时清理
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [count])

  const parsed = blessing ? parseMessage(blessing.message) : { blessing: '', explanation: '' }

  if (isImportant) {
    // 重要里程碑 - 正式弹窗
    return (
      <AnimatePresence>
        {visible && blessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVisible(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm cursor-pointer"
          >
              <motion.div
                key={`milestone-${blessing.count}`}
                initial={{ scale: 0.5, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.3, y: -40 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-b from-amber-50 via-red-50 to-amber-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] border-2 border-amber-300 p-6 max-w-sm w-[85vw] relative overflow-hidden"
              >
                {/* 背景装饰 - 更小 */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-amber-200/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-200/20 rounded-full translate-x-1/3 translate-y-1/3"></div>

                {/* 内容 */}
                <div className="relative z-10 text-center">
                  {/* 顶部装饰条纹 */}
                  <div className="h-0.5 w-16 mx-auto mb-4 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"></div>

                  {/* 里程碑标记 - 改为小球 */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-red-500"
                    ></motion.div>
                    <span className="text-xs font-bold text-amber-900">第 {blessing.count} 份福报</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-amber-400"
                    ></motion.div>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-lg md:text-xl font-bold mb-3" style={{
                    fontFamily: "'STKaiti', 'KaiTi', serif",
                    background: 'linear-gradient(135deg, #d97706, #b91c1c)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    {blessing.title}
                  </h3>

                  {/* 祝福内容 - 更小的字体 */}
                  <p className="text-sm md:text-base font-medium text-amber-900 leading-relaxed mb-3 blessing-serif">
                    {parsed.blessing}
                  </p>

                  {/* 解释内容 */}
                  {parsed.explanation && (
                    <p className="text-xs md:text-sm leading-relaxed text-gray-700 mb-4 blessing-serif opacity-85">
                      {parsed.explanation}
                    </p>
                  )}

                  {/* 底部装饰条纹 */}
                  <div className="h-0.5 w-16 mx-auto mt-4 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"></div>

                  {/* 继续祈福按钮 - 更小 */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      setVisible(false)
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-5 px-6 py-2 bg-gradient-to-r from-amber-400 to-red-400 hover:from-amber-300 hover:to-red-300 text-amber-900 font-bold rounded-full transition-all shadow-lg hover:shadow-xl text-sm"
                  >
                    继续祈福
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // 普通里程碑 - 贺卡样式 - 更紧凑
  return (
    <AnimatePresence>
      {visible && blessing && (
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
              width: 'clamp(220px, 75vw, 280px)',
            }}
          >
            {/* 贺卡主体 - 更紧凑 */}
            <div className="relative bg-gradient-to-br from-amber-50 via-red-50 to-amber-100 rounded-lg overflow-hidden shadow-lg border border-amber-200/40">

              {/* 顶部装饰条纹 - 更小 */}
              <div className="h-0.5 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"></div>

              {/* 内容区域 - 更紧凑 */}
              <div className="p-3 md:p-4 text-center relative">

                {/* 里程碑标记 - 简化为一行小字 */}
                <div className="mb-2">
                  <span className="text-xs font-bold text-red-500">● {blessing.count} ●</span>
                </div>

                {/* 标题 - 更小 */}
                <h3 className="text-sm md:text-base font-bold mb-2" style={{
                  fontFamily: "'STKaiti', 'KaiTi', serif",
                  background: 'linear-gradient(135deg, #d97706, #b91c1c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {blessing.title}
                </h3>

                {/* 祝福语 - 更小 */}
                <p className="text-xs md:text-sm font-medium text-amber-900 mb-2 blessing-serif leading-tight">
                  {parsed.blessing}
                </p>

                {/* 解释文案 - 可选 */}
                {parsed.explanation && (
                  <p className="text-xs leading-tight text-gray-600 mb-2 blessing-serif opacity-80">
                    {parsed.explanation}
                  </p>
                )}
              </div>

              {/* 底部装饰条纹 - 更小 */}
              <div className="h-0.5 bg-gradient-to-r from-amber-400 via-red-400 to-amber-400"></div>
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  )
}
