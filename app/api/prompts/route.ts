import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;
    
    // Fetch prompts from Supabase
    const { data, error, count } = await supabase
      .from('prompts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return NextResponse.json({ 
      prompts: data, 
      total: count,
      page,
      limit,
      totalPages: count ? Math.ceil(count / limit) : 0
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching prompts:', error);
    return NextResponse.json(
      { error: errorMessage || 'Failed to fetch prompts' },
      { status: 500 }
    );
  }
}