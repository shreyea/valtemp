'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])

  useEffect(() => {
    const sparklesArray = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
    }))
    setSparkles(sparklesArray)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute text-yellow-300"
          style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  )
}
