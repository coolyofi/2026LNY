'use client'

import { useState, useCallback, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { usePrayerStore } from '@/lib/store'
import { FloatingText } from '@/app/components/FloatingText/FloatingText'
import { FloatingMessage } from '@/lib/types'

const Bell = dynamic(() => import('@/app/components/Bell/Bell'), { ssr: false })
const Fireworks = dynamic(() => import('@/app/components/Fireworks/Fireworks'), { ssr: false })

export default function Home() {
  const { count, increment, reset } = usePrayerStore()
  const [floatingMessages, setFloatingMessages] = useState<FloatingMessage[]>([])
  const [showGrandFinale, setShowGrandFinale] = useState(false)

  // 1. 赛博敲击反馈：各种“XX +1”
  const additionExpressions = useMemo(() => [
    "好运 +1", "福气 +1", "功德 +1", "财气 +1", "喜气 +1",
    "万福 +1", "吉利 +1", "顺利 +1", "健康 +1", "平安 +1",
    "马力 +1", "锦鲤 +1", "元气 +1", "灵气 +1", "欧气 +1",
    "加薪 +1", "暴富 +1", "脱单 +1", "上榜 +1", "满分 +1"
  ], [])

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

  const handleHit = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    increment()

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

    // Emit multiple small "+1" feedbacks stacked on the bell
    const now = Date.now()
    const feedbacks: FloatingMessage[] = Array.from({ length: 4 }).map((_, i) => ({
      id: now + i,
      text: '+1',
      x: relX + (i - 1.5) * 8, // slight horizontal spread
      y: relY - i * 6, // slight vertical offset between them
      color: '#FFFFFF',
      type: 'feedback'
    }))

    // Environment blessing (drifts slowly)
    const blessingMsg: FloatingMessage = {
      id: now + 1000,
      text: blessingWords[Math.floor(Math.random() * blessingWords.length)],
      x: relX,
      y: relY,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: 'environment'
    }

    setFloatingMessages(prev => [...prev.slice(-40), ...feedbacks, blessingMsg])

    // remove them after a while
    setTimeout(() => {
      setFloatingMessages(prev => prev.filter(msg => !feedbacks.some(f => f.id === msg.id) && msg.id !== blessingMsg.id))
    }, 6000)

    if ((count + 1) % 100 === 0) {
      setShowGrandFinale(true)
    }
  }, [count, increment, blessingWords, additionExpressions])

  return (
    <main className="relative flex flex-col items-center justify-between min-h-screen p-4 overflow-hidden">
      {/* Decorative Border */}
      <div className="absolute inset-4 border-2 border-yellow-500/20 pointer-events-none rounded-xl" />

      {/* Header */}
      <div className="mt-12 text-center z-10">
        <h2 className="text-xl md:text-2xl tracking-[0.3em] font-medium opacity-80 mb-2">
          2026 丙午马年 · 福感积累
        </h2>
        <div className="text-6xl md:text-8xl font-bold text-gold-glow tracking-tighter">
          {count}
        </div>
      </div>

      {/* Bell Area */}
      <div className="flex-1 flex items-center justify-center w-full relative">
        <Bell count={count} onClick={handleHit} />
        
        {/* Floating Messages */}
        <AnimatePresence>
          {floatingMessages.map((msg) => (
            <FloatingText key={msg.id} {...msg} />
          ))}
        </AnimatePresence>

        {/* Milestone Effects */}
        {count > 0 && count % 10 === 0 && !showGrandFinale && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: [0, 1, 0] }}
               transition={{ duration: 1 }}
               className="absolute inset-0 bg-yellow-400/10 pointer-events-none z-0"
             />
        )}
      </div>

      {/* Footer */}
      <div className="mb-12 text-center z-10">
        <div className="px-6 py-3 bg-black/30 backdrop-blur-md rounded-full border border-white/10">
          <p className="text-sm md:text-base tracking-widest opacity-60">
            诚心点击，必有好运 | 当前已开启实时祈福
          </p>
        </div>
      </div>

      {/* Grand Finale Modal */}
      <AnimatePresence>
        {showGrandFinale && (
          <>
            <Fireworks />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6"
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#8b0000] border-4 border-yellow-500 p-8 md:p-12 rounded-3xl text-center shadow-[0_0_50px_rgba(255,207,77,0.5)] max-w-md w-full"
              >
                <div className="text-6xl mb-6">🐎💨</div>
                <h3 className="text-3xl font-bold text-yellow-400 mb-4">十全十美 · 功德圆满</h3>
                <p className="text-lg leading-relaxed mb-8 opacity-90">
                  福满乾坤，气贯长虹！<br/>
                  恭喜你在 2026 积累了 100 份福报。<br/>
                  新的一年，愿你万事马力全开，<br/>
                  前程锦绣，好运势不可挡！
                </p>
                <button
                  onClick={() => { setShowGrandFinale(false); reset(); }}
                  className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-red-900 font-bold rounded-full transition-colors shadow-lg"
                >
                  继续纳福
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
