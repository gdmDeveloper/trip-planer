import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createActionSupabaseClient() {
  const cookieStore = await cookies()

  const allCookies = cookieStore.getAll()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return allCookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}