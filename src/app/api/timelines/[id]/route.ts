import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ success: false, error: "ID Gerekli" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('timelines')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
       // Code PGRST116 means zero rows found
       if (error.code === 'PGRST116') {
         return NextResponse.json({ success: false, error: "Timeline bulunamadı" }, { status: 404 });
       }
       throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Timeline fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch timeline" }, 
      { status: 500 }
    );
  }
}
