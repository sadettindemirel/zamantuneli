import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Bu endpoint'e istek atıldığında veritabanı tablosunu otomatik olarak oluşturacak.
// Normalde bu işlem Supabase SQL Editöründen yapılır, fakat kurulumu kolaylaştırmak için buraya ekliyoruz.
export async function GET() {
  try {
    // Check if the table already exists by trying to select from it
    const { error: checkError } = await supabase.from('timelines').select('id').limit(1);

    // If it throws an error that the relation doesn't exist, we need to create it
    if (checkError && checkError.message.includes('relation "public.timelines" does not exist')) {
      
      // We can't run raw DDL queries through standard Supabase JS client. 
      // The user MUST run this in their Supabase SQL editor:
      
      const setupSQL = `
        CREATE TABLE IF NOT EXISTS public.timelines (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID,
          title TEXT NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Set up Row Level Security (RLS)
        ALTER TABLE public.timelines ENABLE ROW LEVEL SECURITY;
        
        -- Create policies (Allow everyone to read, insert, and update for now)
        -- In a real production app with auth, you'd restrict these policies.
        CREATE POLICY "Allow anonymous reads" ON public.timelines FOR SELECT USING (true);
        CREATE POLICY "Allow anonymous inserts" ON public.timelines FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow anonymous updates" ON public.timelines FOR UPDATE USING (true);
      `;

      return NextResponse.json({
        success: false,
        message: "You need to run this SQL in your Supabase SQL Editor:",
        sql: setupSQL
      });
    }

    return NextResponse.json({ success: true, message: "Timelines table structure looks ready." });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
