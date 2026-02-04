import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ValentineView from './ValentineView'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function PublicViewPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  console.log('🔍 Public View - Loading template:', {
    slug,
    template_type: 'simp',
    is_published: true
  })

  const { data: template, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('template_type', 'simp')
    .eq('is_published', true)
    .single()

  console.log('📊 Public View - Query result:', {
    found: !!template,
    error: error?.message,
    errorCode: error?.code,
    hasData: !!template?.data
  })

  if (error || !template) {
    console.log('❌ Public View - Template not found or not published')
    notFound()
  }

  console.log('✅ Public View - Template loaded:', {
    id: template.id,
    template_type: template.template_type,
    question: template.data?.question?.substring(0, 30) + '...'
  })

  return <ValentineView question={template.data.question} />
}
