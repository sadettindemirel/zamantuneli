import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function POST() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    // Optionally handle error
    console.error("Logout error:", error)
  }

  // Redirect to home page
  redirect('/')
}
