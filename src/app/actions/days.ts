'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { createActionSupabaseClient } from '@/lib/supabase-action'
import { revalidatePath } from 'next/cache'

export async function createDay(tripId: string) {
  const supabase = await createActionSupabaseClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: days } = await admin
    .from('trip_days')
    .select('day_number')
    .eq('trip_id', tripId)
    .order('day_number', { ascending: false })
    .limit(1)

  const nextDay = (days?.[0]?.day_number ?? 0) + 1

  const { data, error } = await admin
    .from('trip_days')
    .insert({ trip_id: tripId, day_number: nextDay, title: `Día ${nextDay}` })
    .select()
    .single()

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/trips/${tripId}`)
  return data
}

export async function updateDay(dayId: string, tripId: string, title: string) {
  const admin = createAdminClient()

  await admin
    .from('trip_days')
    .update({ title })
    .eq('id', dayId)

  revalidatePath(`/dashboard/trips/${tripId}`)
}

export async function deleteDay(dayId: string, tripId: string) {
  const admin = createAdminClient()

  await admin
    .from('trip_days')
    .delete()
    .eq('id', dayId)

  revalidatePath(`/dashboard/trips/${tripId}`)
}