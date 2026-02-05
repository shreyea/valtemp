import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateSlug } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const { email, templateCode, question, templateId } = await request.json();

    const normalizedEmail = email.trim().toLowerCase();

    console.log('🔍 Update Template API - Input:', {
      email: normalizedEmail,
      hasCode: !!templateCode,
      templateId,
      questionLength: question?.length
    });

    if (!normalizedEmail || !templateCode || !templateId) {
      return NextResponse.json(
        { error: 'Email, template code, and template ID are required' },
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

    // First verify the user owns this template
    const { data: template, error: fetchError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', templateId)
      .eq('owner_email', normalizedEmail)
      .eq('template_code', templateCode)
      .eq('template_type', 'simp')
      .single();

    if (fetchError || !template) {
      console.log('❌ Update Template API - Template not found or access denied');
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      );
    }

    // Ensure slug exists
    const slug = template.slug || generateSlug();

    console.log('💾 Updating template:', {
      templateId,
      questionLength: question.length,
      slug
    });

    // Update the template
    const { data, error } = await supabase
      .from('projects')
      .update({ 
        data: { question },
        is_published: true,
        slug: slug
      })
      .eq('id', templateId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update failed:', {
        error: error.message,
        code: error.code,
        templateId
      });
      return NextResponse.json(
        { error: 'Failed to update template' },
        { status: 500 }
      );
    }

    console.log('✅ Updated successfully:', {
      templateId,
      is_published: true,
      slug
    });

    return NextResponse.json({
      success: true,
      template: {
        id: data.id,
        slug: data.slug,
        owner_email: data.owner_email,
        template_type: data.template_type,
        is_published: data.is_published,
        data: data.data
      }
    });

  } catch (error: any) {
    console.error('💥 Update Template API - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
