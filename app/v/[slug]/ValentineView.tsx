'use client'

import ValentineCard from '@/components/ValentineCard'
import FloatingHearts from '@/components/FloatingHearts'
import Sparkles from '@/components/Sparkles'
import { Heart, Star, Flower2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface ValentineViewProps {
  question: string
}

export default function ValentineView({ question }: ValentineViewProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scrapbook paper texture background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(135deg, #fff9fb 0%, #fff5f7 30%, #fef7f0 60%, #faf5ff 100%)
          `,
        }}
      />

      {/* Subtle pattern overlay for paper texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #000 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, #000 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Scrapbook corner decorations */}
      <div className="absolute top-6 left-6 z-[5]">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <div className="w-16 h-16 border-l-3 border-t-3 border-rose-200/60 rounded-tl-2xl" />
          <Star className="absolute top-2 left-2 w-6 h-6 text-amber-300/70 fill-amber-300/70" />
        </motion.div>
      </div>

      <div className="absolute top-6 right-6 z-[5]">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        >
          <div className="w-16 h-16 border-r-3 border-t-3 border-pink-200/60 rounded-tr-2xl" />
          <Heart className="absolute top-2 right-2 w-6 h-6 text-rose-300/70 fill-rose-300/70" />
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 z-[5]">
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        >
          <div className="w-16 h-16 border-l-3 border-b-3 border-purple-200/60 rounded-bl-2xl" />
          <Flower2 className="absolute bottom-2 left-2 w-6 h-6 text-pink-300/70" />
        </motion.div>
      </div>

      <div className="absolute bottom-6 right-6 z-[5]">
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
        >
          <div className="w-16 h-16 border-r-3 border-b-3 border-amber-200/60 rounded-br-2xl" />
          <Star className="absolute bottom-2 right-2 w-6 h-6 text-amber-300/70 fill-amber-300/70" />
        </motion.div>
      </div>

      {/* Decorative washi tape strips */}
      <div
        className="absolute top-0 left-[15%] w-20 h-8 rotate-[-5deg] z-[4]"
        style={{
          background: 'linear-gradient(90deg, rgba(254,205,211,0.6) 0%, rgba(251,207,232,0.4) 100%)',
          borderRadius: '2px',
        }}
      />
      <div
        className="absolute top-0 right-[20%] w-16 h-7 rotate-[8deg] z-[4]"
        style={{
          background: 'linear-gradient(90deg, rgba(253,230,138,0.6) 0%, rgba(254,243,199,0.4) 100%)',
          borderRadius: '2px',
        }}
      />
      <div
        className="absolute bottom-0 left-[25%] w-18 h-7 rotate-[3deg] z-[4]"
        style={{
          background: 'linear-gradient(90deg, rgba(233,213,255,0.5) 0%, rgba(243,232,255,0.3) 100%)',
          borderRadius: '2px',
        }}
      />
      <div
        className="absolute bottom-0 right-[15%] w-20 h-8 rotate-[-6deg] z-[4]"
        style={{
          background: 'linear-gradient(90deg, rgba(254,205,211,0.5) 0%, rgba(255,241,242,0.3) 100%)',
          borderRadius: '2px',
        }}
      />

      {/* Soft gradient blobs */}
      <motion.div
        className="absolute top-20 left-[10%] w-40 h-40 bg-pink-200/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 right-[10%] w-48 h-48 bg-purple-200/25 rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.35, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-[5%] w-32 h-32 bg-amber-100/30 rounded-full blur-2xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-1/3 right-[8%] w-36 h-36 bg-rose-100/35 rounded-full blur-2xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.45, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
      />

      {/* Background particles */}
      <FloatingHearts />
      <Sparkles />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <ValentineCard
          question={question}
          isEditable={false}
        />
      </div>


    </div>
  )
}
