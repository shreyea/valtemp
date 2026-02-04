export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-pink-200">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md text-center">
        <div className="text-6xl mb-4">💔</div>
        <h1 className="text-2xl font-bold text-pink-600 mb-4">Template Not Found</h1>
        <p className="text-gray-600 mb-6">
          This Valentine template doesn&apos;t exist or has been unpublished.
        </p>
        <a
          href="/auth/login"
          className="inline-block bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all transform hover:scale-105"
        >
          Create Your Own 💝
        </a>
      </div>
    </div>
  )
}
