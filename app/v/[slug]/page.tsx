import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import ValentineView from './ValentineView'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getTemplate(slug: string) {
  try {
    // Create Supabase client with service role key for bypassing RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('🔍 Public View - Fetching template:', { slug });

    const { data: template, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('template_type', 'simp')
      .eq('is_published', true)
      .single();

    console.log('📊 Public View - Query result:', {
      found: !!template,
      error: error?.message,
      hasData: !!template?.data
    });

    if (error || !template) {
      console.log('❌ Public View - Template not found');
      return null;
    }

    console.log('✅ Public View - Template found:', {
      id: template.id,
      question: template.data?.question?.substring(0, 30)
    });

    return template;
  } catch (error) {
    console.error('💥 Public View - Error:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const template = await getTemplate(slug);

  if (template?.data?.question) {
    return {
      title: template.data.question,
      description: 'A special Valentine message just for you!',
    }
  }

  return {
    title: 'Will you be my Valentine?',
    description: 'A special Valentine message just for you!',
  }
}

export default async function PublicViewPage({ params }: PageProps) {
  const { slug } = await params
  const template = await getTemplate(slug);

  if (!template || !template.data?.question) {
    notFound()
  }

  return <ValentineView question={template.data.question} />
}
