'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Sparkles as SparkleIcon, Star, Circle } from 'lucide-react'

export default function Sparkles() {
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
    size: number;
    type: 'star' | 'sparkle' | 'dot';
    opacity: number;
  }>>([])

  useEffect(() => {
    const sparklesArray = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 12 + Math.random() * 20, // Larger sizes: 12-32px
      type: (['star', 'sparkle', 'dot'] as const)[Math.floor(Math.random() * 3)],
      opacity: 0.5 + Math.random() * 0.4, // More visible: 0.5-0.9
    }))
    setSparkles(sparklesArray)
  }, [])

  const pastelColors = [
    '#fff176', // bright yellow
    '#ffcc80', // warm orange
    '#80cbc4', // mint
    '#81d4fa', // sky blue
    '#ce93d8', // lavender
    '#f48fb1', // blush
    '#a5d6a7', // soft green
  ]

  return (
    <div className="fixed inset-0 pointer-events-none z-[1]">
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            color: pastelColors[sparkle.id % pastelColors.length],
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
          }}
          animate={{
            scale: [0, 1.2, 1, 0],
            opacity: [0, sparkle.opacity, sparkle.opacity * 0.8, 0],
            rotate: sparkle.type === 'dot' ? [0, 0] : [0, 180],
          }}
          transition={{
            duration: 3,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        >
          {sparkle.type === 'star' ? (
            <Star size={sparkle.size} fill="currentColor" strokeWidth={0} />
          ) : sparkle.type === 'sparkle' ? (
            <SparkleIcon size={sparkle.size} fill="currentColor" strokeWidth={1} />
          ) : (
            <Circle size={sparkle.size * 0.4} fill="currentColor" strokeWidth={0} />
          )}
        </motion.div>
      ))}
    </div>
  )
}
