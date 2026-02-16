'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrayerStore } from '@/lib/store'
import { FloatingText } from '@/app/components/FloatingText/FloatingText'
import { FloatingMessage } from '@/lib/types'

export default function Home() {
  const { count, increment } = usePrayerStore()
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([])
  const [isAutoClicking, setIsAutoClicking] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const clickCountRef = useRef(0) // 本地点击计数
  const nextBlessingRef = useRef(Math.floor(Math.random() * 5) + 4) // 首次4-8次按下时触发
  const autoClickIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoClickCountRef = useRef(0) // 自动敲击次数

  const blessingWords = useMemo(() => [
    "福满乾坤", "马到成功", "万事大吉", "财源滚滚", "心想事成",
    "步步高升", "龙马精神", "吉祥如意", "鸿运当头", "福星高照",
    "金玉满堂", "富贵吉祥", "平安喜乐", "健康长寿", "幸福美满",
    "事业有成", "爱情甜蜜", "家庭和睦", "学业进步", "贵人相助",
    "时来运转", "官运亨通", "财神降临", "福寿康宁", "好运连连",
    "一帆风顺", "二龙腾飞", "三阳开泰", "四季平安", "五福临门",
    "六六大顺", "七星高照", "八方来财", "九九同心", "十全十美",
    "百年好合", "千里送金", "万寿无疆", "花开富贵", "竹报平安",
    "大吉大利", "年年有余", "岁岁平安", "天天开心", "五谷丰登",
    "金榜题名", "前程似锦", "飞黄腾达", "平步青云", "锦绣前程",
    "财源茂盛", "生意兴隆", "日进斗金", "和气生财", "招财进宝",
    "出入平安", "身体健康", "笑口常开", "万事胜意", "如鱼得水",
    "紫气东来", "吉星高照", "祥云瑞气", "喜气盈门", "福满人间",
    "开门见喜", "大红大紫", "红红火火", "心花怒放", "喜笑颜开",
    "瑞雪兆丰", "春回大地", "万象更新", "春意盎然", "生机勃勃",
    "前途无量", "一劳永逸", "一鸣惊人", "一举成名", "一日千里",
    "双喜临门", "三生有幸", "四海升平", "独占鳌头", "旗开得胜",
    "美梦成真", "好梦圆圆", "天赐福缘", "地灵人杰", "天长地久",
    "福寿双全", "福禄双增", "富贵盈门", "金玉满怀", "福泽深厚"
  ], [])

  const colors = ['#FFD700', '#FFAA00', '#FFEB3B', '#FF9800', '#FFC107', '#FF5722']

  // 创建全局 AudioContext（重用，避免资源耗尽）
  const audioContextRef = useRef<AudioContext | null>(null)

  const playClickSound = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const audioContext = audioContextRef.current
      
      // 如果 context 被暂停，恢复它
      if (audioContext.state === 'suspended') {
        audioContext.resume()
      }
      
      const oscillator = audioContext.createOscillator()
      const gain = audioContext.createGain()
      
      oscillator.connect(gain)
      gain.connect(audioContext.destination)
      
      // 设置音效参数 - 清脆的"叮"声
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
      
      gain.gain.setValueAtTime(0.3, audioContext.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      // 浏览器不支持 Web Audio API，静默失败
    }
  }, [])

  const handleHit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    increment()
    clickCountRef.current += 1 // 增加本地点击计数

    // 播放点击音效
    playClickSound()

    // Get viewport coords
    let clientX: number, clientY: number
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    // Find bell bounding rect to convert to container-local coords
    const targetEl = (e.target as Element)?.closest?.('.bell-root') as HTMLElement | null
    const rect = targetEl?.getBoundingClientRect() ?? { left: 0, top: 0 }
    const relX = clientX - rect.left
    const relY = clientY - rect.top

    // Emit 1 random "+1" feedback 
    const blessingPrefixes = [
      '好运', '福气', '功德', '财气', '喜气',
      '万福', '吉利', '顺利', '健康', '平安',
      '马力', '锦鲤', '元气', '灵气', '欧气',
      '加薪', '暴富', '脱单', '上榜', '满分'
    ]
    
    // Generate 1 feedback
    const feedbacks: FloatingMessage[] = [{
      id: Date.now() + Math.random() * 10000,
      text: `${blessingPrefixes[Math.floor(Math.random() * blessingPrefixes.length)]} +1`,
      x: relX,
      y: relY,
      color: '#FFFFFF',
      type: 'feedback'
    }]

    // Randomly generate environment blessings (每4-8次按下触发一次)
    const blessingMsgs: FloatingMessage[] = []
    
    if (clickCountRef.current >= nextBlessingRef.current) {
      // 显示祝福词 - 在整个屏幕范围内随机显示
      // 在屏幕宽度的20%-80%范围内随机显示（避免超出边界）
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const minX = screenWidth * 0.1
      const maxX = screenWidth * 0.9
      const minY = screenHeight * 0.1
      const maxY = screenHeight * 0.85
      
      const randomX = minX + Math.random() * (maxX - minX)
      const randomY = minY + Math.random() * (maxY - minY)
      
      blessingMsgs.push({
        id: Date.now() + Math.random() * 10000 + 1000,
        text: blessingWords[Math.floor(Math.random() * blessingWords.length)],
        x: randomX,
        y: randomY,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'environment'
      })
      // 计算下一次触发的点数 (当前点数 + 4-8)
      nextBlessingRef.current = clickCountRef.current + Math.floor(Math.random() * 5) + 4
    }

    setFloatingMessages(prev => [...prev.slice(-50), ...feedbacks, ...blessingMsgs])

    // remove them after a while
    setTimeout(() => {
      setFloatingMessages(prev => prev.filter(msg => !feedbacks.some(f => f.id === msg.id) && !blessingMsgs.some(b => b.id === msg.id)))
    }, 8000)
  }, [increment, blessingWords, playClickSound])

  // 自动敲击功能 - 每次点击"自动点"按钮，敲108下然后自动停止
  useEffect(() => {
    if (isAutoClicking) {
      autoClickCountRef.current = 0 // 重置计数
      autoClickIntervalRef.current = setInterval(() => {
        // 模拟点击事件
        const fakeEvent = {
          clientX: window.innerWidth / 2,
          clientY: window.innerHeight / 2,
          target: document.querySelector('.bell-root'),
          preventDefault: () => {},
          stopPropagation: () => {}
        } as any
        handleHit(fakeEvent)
        
        // 增加自动点击计数
        autoClickCountRef.current += 1
        
        // 达到108下后自动停止
        if (autoClickCountRef.current >= 108) {
          setIsAutoClicking(false)
        }
      }, 600) // 每600ms敲一次，速度适中
    } else {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current)
        autoClickIntervalRef.current = null
      }
    }

    return () => {
      if (autoClickIntervalRef.current) {
        clearInterval(autoClickIntervalRef.current)
      }
    }
  }, [isAutoClicking, handleHit])

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen p-4">
      {/* Decorative Border */}
      <div className="absolute inset-4 border-2 border-yellow-500/20 pointer-events-none rounded-xl" />

      {/* Header */}
      <div className="mt-12 text-center z-10">
        <h2 className="text-xl md:text-2xl tracking-[0.3em] font-medium opacity-80 mb-2 blessing-calligraphy">
          丙午马年 · 虔诚祈福
        </h2>
        <div className="text-6xl md:text-8xl font-bold text-gold-glow tracking-tighter">
          {count}
        </div>
      </div>

      {/* Bell Area */}
      <div className="flex-1 flex items-center justify-center w-full relative z-20">
        <button 
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleHit(e)
          }}
          className="text-8xl cursor-pointer select-none active:scale-95 bell-root"
          style={{
            filter: 'drop-shadow(0 0 40px rgba(212,0,0,0.8))',
            border: 'none',
            background: 'none',
            padding: 0,
            pointerEvents: 'auto',
            display: 'inline-block',
          }}
        >
          🧧
        </button>
        
        {/* Floating Messages */}
        <AnimatePresence>
          {floatingMessages.map((msg) => (
            <FloatingText key={msg.id} {...msg} />
          ))}
        </AnimatePresence>

        {/* Milestone Effects */}
        {count > 0 && count % 10 === 0 && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 1 }}
               className="absolute inset-0 bg-yellow-400/10 pointer-events-none z-0"
             />
        )}
      </div>

      {/* Footer */}
      <div className="mb-10 text-center z-10">
        <div className="px-4 md:px-6 py-2 md:py-3 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
          <p className="text-xs md:text-sm tracking-widest opacity-70" style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}>
            每一击 · 都是福
          </p>
        </div>
      </div>

      {/* 自动点击按钮 - 右下角 */}
      <motion.div className="fixed bottom-6 right-6 z-40 group">
        <motion.button
          onClick={() => setIsAutoClicking(!isAutoClicking)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          animate={{
            backgroundColor: isAutoClicking ? 'rgba(212, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)',
            boxShadow: isAutoClicking ? '0 0 15px rgba(212, 0, 0, 0.6)' : 'none'
          }}
          className="px-3 py-1.5 text-xs rounded-full border border-white/30 transition-all hover:border-white/50 opacity-60 hover:opacity-100 z-40"
        >
          {isAutoClicking ? '🔴 持诵中' : '⚪ 持诵'}
        </motion.button>
        
        {/* 提示框 */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 px-4 py-3 bg-red-900/90 text-white text-xs rounded border border-red-400/50 pointer-events-none whitespace-nowrap"
              style={{ fontFamily: "'STKaiti', 'KaiTi', serif" }}
            >
              <div className="font-semibold">一心持诵</div>
              <div className="text-xs opacity-80 mt-1">一百零八遍 · 消解烦恼</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </main>
  )
}
