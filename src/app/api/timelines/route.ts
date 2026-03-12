import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST: Create a new timeline or Update an existing one
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, title, events, titleSlide, appearance } = body;

    // Build timeline data with optional title slide
    let timelineData: any = {
      events: events
    };

    if (titleSlide) {
       timelineData.title = titleSlide;
    } else {
       timelineData.title = { text: { headline: title, text: "" } };
    }

    if (appearance) {
       timelineData.appearance = appearance;
    }

    if (id) {
      // Update existing
      const { data, error } = await supabase
        .from('timelines')
        .update({
          title,
          data: timelineData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json({ success: true, timelineId: data.id });
    } else {
      // Create new
      const { data, error } = await supabase
        .from('timelines')
        .insert([{
          title,
          data: timelineData
        }])
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json({ success: true, timelineId: data.id });
    }

  } catch (error: any) {
    console.error("Timeline save error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save timeline" }, 
      { status: 500 }
    );
  }
}
