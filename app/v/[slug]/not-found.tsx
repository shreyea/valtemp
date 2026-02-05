import { Heart, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-love relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="bg-white/95 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10 border-4 border-pink-100/50">
        <div className="flex justify-center mb-6">
          <AlertCircle className="w-20 h-20 text-pink-500 drop-shadow-lg" />
        </div>
        <h1 className="text-3xl font-handwritten text-pink-600 mb-4">Template Not Found</h1>
        <p className="text-gray-600 mb-8 font-soft text-lg">
          This Valentine template doesn&apos;t exist or has been unpublished.
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-400 to-rose-500 text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-xl font-soft border-2 border-white/30"
          style={{
            boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)'
          }}
        >
          <Heart className="w-5 h-5 fill-white" />
          Create Your Own
        </a>
      </div>
    </div>
  )
}
