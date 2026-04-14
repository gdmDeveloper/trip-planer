'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { createActionSupabaseClient } from '@/lib/supabase-action'
import { revalidatePath } from 'next/cache'

export async function createActivity(formData: FormData) {
  const supabase = await createActionSupabaseClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const day_id = formData.get('day_id') as string
  const trip_id = formData.get('trip_id') as string
  const title = formData.get('title') as string
  const place = formData.get('place') as string
  const time = formData.get('time') as string
  const notes = formData.get('notes') as string

  const { data: existing } = await admin
    .from('activities')
    .select('order_index')
    .eq('day_id', day_id)
    .order('order_index', { ascending: false })
    .limit(1)

  const order_index = (existing?.[0]?.order_index ?? -1) + 1

  const { error } = await admin
    .from('activities')
    .insert({
      day_id,
      title,
      place: place || null,
      time: time || null,
      notes: notes || null,
      order_index,
    })

  if (error) throw new Error(error.message)

  revalidatePath(`/dashboard/trips/${trip_id}`)
}

export async function toggleFavorite(
  activityId: string,
  tripId: string,
  current: boolean
) {
  const admin = createAdminClient()

  await admin
    .from('activities')
    .update({ is_favorite: !current })
    .eq('id', activityId)

  revalidatePath(`/dashboard/trips/${tripId}`)
}

export async function deleteActivity(activityId: string, tripId: string) {
  const admin = createAdminClient()

  await admin
    .from('activities')
    .delete()
    .eq('id', activityId)

  revalidatePath(`/dashboard/trips/${tripId}`)
}