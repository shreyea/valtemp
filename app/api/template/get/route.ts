import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, templateCode } = await request.json();

    const normalizedEmail = email.trim().toLowerCase();

    console.log('🔍 Get Template API - Input:', {
      email: normalizedEmail,
      hasCode: !!templateCode
    });

    if (!normalizedEmail || !templateCode) {
      return NextResponse.json(
        { error: 'Email and template code are required' },
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

    // Query for template
    const { data: template, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_email', normalizedEmail)
      .eq('template_code', templateCode)
      .eq('template_type', 'simp')
      .single();

    console.log('📊 Get Template API - Query result:', {
      found: !!template,
      error: error?.message,
      templateId: template?.id
    });

    if (error || !template) {
      console.log('❌ Get Template API - Template not found');
      return NextResponse.json(
        { error: 'Template not found or access denied' },
        { status: 404 }
      );
    }

    console.log('✅ Get Template API - Template found:', {
      templateId: template.id,
      slug: template.slug,
      hasData: !!template.data
    });

    // Initialize data if NULL
    let templateData = template.data;
    if (!templateData || !templateData.question) {
      console.log('🔧 Initializing NULL data');
      templateData = { question: 'Will you be my Valentine? 💖' };
      
      // Update the database with initialized data
      const { error: updateError } = await supabase
        .from('projects')
        .update({ data: templateData })
        .eq('id', template.id);
      
      if (updateError) {
        console.error('Error initializing data:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        slug: template.slug,
        owner_email: template.owner_email,
        template_type: template.template_type,
        template_code: template.template_code,
        is_published: template.is_published,
        data: templateData
      }
    });

  } catch (error: any) {
    console.error('💥 Get Template API - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
