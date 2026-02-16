'use client'

import { motion } from 'framer-motion'

interface BellProps {
  count: number
  onClick: (e: React.MouseEvent | React.TouchEvent) => void
}

export default function Bell({ count, onClick }: BellProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(e)
  }

  const handleTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClick(e)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 0.1,
        type: "spring",
        stiffness: 300
      }}
      className="relative z-10 cursor-pointer select-none bell-root"
      style={{
        fontSize: 'clamp(120px, 30vw, 280px)',
        lineHeight: '1',
        filter: 'drop-shadow(0 0 40px rgba(212,0,0,0.8))',
      }}
      onClick={handleClick}
      onTouchStart={handleTouch}
    >
      <span className="relative inline-block">
        🧧
        {/* Shine effect for milestones */}
        {count > 0 && count % 10 === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 2] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl -z-10"
          />
        )}
      </span>
    </motion.div>
  )
}
