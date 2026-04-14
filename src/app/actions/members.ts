'use server'

import { createAdminClient } from '@/lib/supabase-admin'
import { createActionSupabaseClient } from '@/lib/supabase-action'
import { revalidatePath } from 'next/cache'

export async function inviteByEmail(tripId: string, email: string) {
  const supabase = await createActionSupabaseClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data: { users: authUsers } } = await admin.auth.admin.listUsers()
  const target = authUsers.find(u => u.email === email)

  if (!target) return { error: 'No existe ningún usuario con ese email' }

  // Comprobar si ya es miembro
  const { data: existing } = await admin
    .from('trip_members')
    .select('id')
    .eq('trip_id', tripId)
    .eq('user_id', target.id)
    .single()

  if (existing) return { error: 'Este usuario ya forma parte del viaje' }

  await admin
    .from('trip_members')
    .insert({ trip_id: tripId, user_id: target.id, role: 'editor' })

  revalidatePath(`/dashboard/trips/${tripId}`)
  return { success: true }
}

export async function generateInviteLink(tripId: string) {
  const supabase = await createActionSupabaseClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  // Reusar token existente si no ha expirado
  const { data: existing } = await admin
    .from('trip_invites')
    .select('token')
    .eq('trip_id', tripId)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (existing) return { token: existing.token }

  const { data, error } = await admin
    .from('trip_invites')
    .insert({ trip_id: tripId, created_by: user.id })
    .select('token')
    .single()

  if (error) throw new Error(error.message)

  return { token: data.token }
}

export async function removeMember(tripId: string, userId: string) {
  const admin = createAdminClient()

  await admin
    .from('trip_members')
    .delete()
    .eq('trip_id', tripId)
    .eq('user_id', userId)

  revalidatePath(`/dashboard/trips/${tripId}`)
}