import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    console.log('🔍 Public Template API - Input:', {
      slug
    });

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

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

    // Query for published template
    const { data: template, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .eq('template_type', 'simp')
      .eq('is_published', true)
      .single();

    console.log('📊 Public Template API - Query result:', {
      found: !!template,
      error: error?.message,
      templateId: template?.id
    });

    if (error || !template) {
      console.log('❌ Public Template API - Template not found');
      return NextResponse.json(
        { error: 'Template not found or not published' },
        { status: 404 }
      );
    }

    console.log('✅ Public Template API - Template found:', {
      templateId: template.id,
      slug: template.slug,
      hasData: !!template.data
    });

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        slug: template.slug,
        template_type: template.template_type,
        is_published: template.is_published,
        data: template.data
      }
    });

  } catch (error: any) {
    console.error('💥 Public Template API - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
