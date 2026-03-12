import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST: Create a new timeline or Update an existing one
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const body = await request.json();
    const { id, title, events, titleSlide, appearance, isPublish } = body;

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

    const targetStatus = isPublish ? 'published' : 'draft';

    if (id) {
      // Update existing
      // Only allow update if timeline belongs to user OR if timeline has no user (anonymous creation)
      // To strictly enforce, we just update where id matches.
      const { data, error } = await supabase
        .from('timelines')
        .update({
          title,
          data: timelineData,
          status: targetStatus,
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
          data: timelineData,
          user_id: user?.id || null, // Attach user if logged in
          status: targetStatus
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
