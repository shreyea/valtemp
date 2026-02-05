import { notFound } from 'next/navigation'
import ValentineView from './ValentineView'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicViewPage({ params }: PageProps) {
  const { slug } = await params

  console.log('🔍 Public View - Loading template:', {
    slug,
    template_type: 'simp',
    is_published: true
  })

  try {
    // Fetch published template via API (bypasses RLS)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/template/public?slug=${encodeURIComponent(slug)}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      console.log('❌ Public View - Template not found or not published')
      notFound()
    }

    const result = await response.json()

    console.log('📊 Public View - API result:', {
      found: !!result.template,
      hasData: !!result.template?.data
    })

    if (!result.success || !result.template) {
      console.log('❌ Public View - Template not found')
      notFound()
    }

    const template = result.template

    console.log('✅ Public View - Template loaded:', {
      id: template.id,
      template_type: template.template_type,
      question: template.data?.question?.substring(0, 30) + '...'
    })

    return <ValentineView question={template.data.question} />
  } catch (error) {
    console.error('💥 Public View - Error:', error)
    notFound()
  }
}
