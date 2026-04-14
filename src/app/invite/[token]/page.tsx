import { createAdminClient } from '@/lib/supabase-admin';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const supabase = await createServerSupabaseClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no está logueado, guardar el token y redirigir a login
  if (!user) {
    redirect(`/login?invite=${token}`);
  }

  // Buscar el invite
  const { data: invite } = await admin
    .from('trip_invites')
    .select('*')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!invite) {
    redirect('/dashboard?error=invite_invalid');
  }

  // Comprobar si ya es miembro
  const { data: existing } = await admin
    .from('trip_members')
    .select('id')
    .eq('trip_id', invite.trip_id)
    .eq('user_id', user.id)
    .single();

  if (!existing) {
    await admin
      .from('trip_members')
      .insert({ trip_id: invite.trip_id, user_id: user.id, role: 'editor' });
  }

  redirect(`/dashboard/trips/${invite.trip_id}`);
}
