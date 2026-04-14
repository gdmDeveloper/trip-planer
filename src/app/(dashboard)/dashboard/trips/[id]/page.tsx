import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TripItinerary } from '@/components/trips/trip-itinerary';
import { MembersSheet } from '@/components/trips/members-sheet';
import type { TripDayWithActivities } from '@/types/database';

interface TripPageProps {
  params: Promise<{ id: string }>;
}

export default async function TripPage({ params }: TripPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: trip } = await admin.from('trips').select('*').eq('id', id).single();

  if (!trip) redirect('/dashboard');

  const { data: days } = await admin
    .from('trip_days')
    .select('*, activities(*)')
    .eq('trip_id', id)
    .order('day_number', { ascending: true });

  const { data: members } = await admin
    .from('trip_members')
    .select('user_id, role')
    .eq('trip_id', id);

  // Obtener emails de los miembros
  const {
    data: { users: authUsers },
  } = await admin.auth.admin.listUsers();
  const membersWithEmail = (members ?? []).map((m) => ({
    ...m,
    email: authUsers.find((u) => u.id === m.user_id)?.email,
  }));

  const typedDays = (days ?? []) as TripDayWithActivities[];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-white border-b border-slate-200 px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-slate-900 truncate">{trip.title}</h1>
            {trip.description && (
              <p className="text-xs text-slate-500 truncate">{trip.description}</p>
            )}
          </div>
          <MembersSheet tripId={id} members={membersWithEmail} currentUserId={user.id} />
        </div>
      </div>

      <TripItinerary days={typedDays} tripId={id} />
    </div>
  );
}
