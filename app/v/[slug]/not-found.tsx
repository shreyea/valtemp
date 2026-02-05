import { Heart, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pastel-love relative overflow-hidden">
      {/* Animated background overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md text-center relative z-10">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-16 h-16 text-pink-600" />
        </div>
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Template Not Found</h1>
        <p className="text-gray-600 mb-6">
          This Valentine template doesn&apos;t exist or has been unpublished.
        </p>
        <a
          href="/auth/login"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold transition-all transform opacity-20 hover:opacity-60"
        >
          <Heart className="w-5 h-5 fill-white" />
          Create Your Own
        </a>
      </div>
    </div>
  )
}
