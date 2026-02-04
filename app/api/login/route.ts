import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { email, templateCode } = await request.json();

    // Normalize email (works with ANY email address - no restrictions!)
    const normalizedEmail = email.trim().toLowerCase();

    console.log('🔍 Login API - Input:', {
      originalEmail: email,
      normalizedEmail,
      templateCode: templateCode ? '***' : 'missing',
      templateType: 'simp',
      note: 'System accepts ANY email - no hardcoded restrictions'
    });

    // Validate inputs
    if (!normalizedEmail || !templateCode) {
      console.log('❌ Login API - Missing credentials');
      return NextResponse.json(
        { error: 'Email and template code are required. If you need help, contact @thecraftingfactory on Instagram.' },
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
    console.log('🔎 Login API - Querying projects with:', {
      owner_email: normalizedEmail,
      template_code: '***',
      template_type: 'simp'
    });

    const { data: template, error } = await supabase
      .from('projects')
      .select('*')
      .eq('owner_email', normalizedEmail)
      .eq('template_code', templateCode)
      .eq('template_type', 'simp')
      .single();

    console.log('📊 Login API - Query result:', {
      found: !!template,
      error: error?.message,
      errorCode: error?.code,
      templateId: template?.id
    });

    if (error || !template) {
      console.log('❌ Login API - Authentication failed');
      return NextResponse.json(
        { error: 'Invalid email or template code. If you need help, contact @thecraftingfactory on Instagram.' },
        { status: 401 }
      );
    }

    console.log('✅ Login API - Authentication successful:', {
      templateId: template.id,
      slug: template.slug,
      hasData: !!template.data
    });

    // Return success with template info
    return NextResponse.json({
      success: true,
      template: {
        id: template.id,
        slug: template.slug,
        owner_email: template.owner_email,
        template_type: template.template_type,
        is_published: template.is_published,
        data: template.data
      }
    });

  } catch (error: any) {
    console.error('💥 Login API - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. If you need help, contact @thecraftingfactory on Instagram.' },
      { status: 500 }
    );
  }
}