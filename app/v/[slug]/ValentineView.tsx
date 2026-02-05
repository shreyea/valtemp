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
      
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8">
        <ValentineCard
          question={question}
          isEditable={false}
        />
      </div>

      <div className="fixed bottom-4 left-0 right-0 text-center z-20">
        <a
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full text-pink-600 hover:bg-white transition-all shadow-xl font-semibold hover:scale-105 transform"
        >
          <Heart className="w-5 h-5 fill-pink-600" />
          Create Your Own
        </a>
      </div>
    </div>
  )
}
