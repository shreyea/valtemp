'use client'

import ValentineCard from '@/components/ValentineCard'
import FloatingHearts from '@/components/FloatingHearts'
import Sparkles from '@/components/Sparkles'
import { Heart } from 'lucide-react'

interface ValentineViewProps {
  question: string
}

export default function ValentineView({ question }: ValentineViewProps) {
  return (
    <div className="min-h-screen bg-pastel-love relative overflow-hidden">
      <FloatingHearts />
      <Sparkles />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <ValentineCard
          question={question}
          isEditable={false}
        />
      </div>

      <div className="fixed bottom-6 left-0 right-0 text-center z-20">
        <a
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full text-pink-600 transition-all shadow-lg font-soft font-semibold transform opacity-15 hover:opacity-70 border-2 border-pink-100/50"
        >
          <Heart className="w-5 h-5 fill-pink-600" />
          Create Your Own
        </a>
      </div>
    </div>
  )
}
