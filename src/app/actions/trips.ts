'use server'

import { createActionSupabaseClient } from '@/lib/supabase-action'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createTrip(formData: FormData) {
  const supabase = await createActionSupabaseClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const start_date = formData.get('start_date') as string
  const end_date = formData.get('end_date') as string

  const { data: trip, error } = await admin
    .from('trips')
    .insert({ title, description, start_date, end_date })
    .select()
    .single()

  if (error || !trip) throw new Error(`${error?.message}`)

  await admin
    .from('trip_members')
    .insert({ trip_id: trip.id, user_id: user.id, role: 'owner' })

  revalidatePath('/dashboard')
  redirect(`/dashboard/trips/${trip.id}`)
}

export async function deleteTrip(tripId: string) {
  const supabase = await createActionSupabaseClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  await admin
    .from('trips')
    .delete()
    .eq('id', tripId)

  revalidatePath('/dashboard')
}