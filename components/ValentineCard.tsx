'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Heart, X } from 'lucide-react'

interface ValentineCardProps {
  question: string
  onQuestionChange?: (question: string) => void
  isEditable: boolean
}

export default function ValentineCard({ question, onQuestionChange, isEditable }: ValentineCardProps) {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const noButtonRef = useRef<HTMLButtonElement>(null)

  const handleYesClick = () => {
    // Trigger confetti
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }

  const handleNoHover = () => {
    if (!noButtonRef.current) return
    
    // Keep button within a constrained area (300x200px around center)
    const maxX = 150
    const maxY = 100
    
    const newX = Math.random() * maxX * 2 - maxX
    const newY = Math.random() * maxY * 2 - maxY
    
    setNoButtonPos({ x: newX, y: newY })
  }

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full mx-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div 
          className="flex justify-center mb-6"
          animate={{ 
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="w-20 h-20 md:w-28 md:h-28 text-pink-500 fill-pink-500" />
        </motion.div>
        
        {isEditable ? (
          <input
            type="text"
            value={question}
            onChange={(e) => onQuestionChange?.(e.target.value)}
            className="text-2xl md:text-4xl font-bold text-pink-600 text-center w-full bg-transparent border-b-2 border-pink-300 focus:outline-none focus:border-pink-500 transition-colors px-4 py-2"
            placeholder="Enter your question..."
          />
        ) : (
          <h2 className="text-2xl md:text-4xl font-bold text-pink-600 px-4">
            {question}
          </h2>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 relative min-h-[80px]"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleYesClick}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2"
        >
          <Heart className="w-5 h-5 fill-white" />
          Yes
        </motion.button>

        <motion.button
          ref={noButtonRef}
          onMouseEnter={handleNoHover}
          onTouchStart={handleNoHover}
          animate={{
            x: noButtonPos.x,
            y: noButtonPos.y,
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 15,
          }}
          className="bg-gray-300 text-gray-700 px-8 py-4 rounded-full text-xl font-bold shadow-lg cursor-pointer flex items-center gap-2"
        >
          <X className="w-5 h-5" />
          No
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center text-gray-500 mt-8 text-sm"
      >
        Try clicking &quot;No&quot; if you dare...
      </motion.p>
    </motion.div>
  )
}
