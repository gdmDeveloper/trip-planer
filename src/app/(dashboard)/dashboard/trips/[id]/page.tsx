import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
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

  const {
    data: { users: authUsers },
  } = await admin.auth.admin.listUsers();
  const membersWithEmail = (members ?? []).map((m) => ({
    ...m,
    email: authUsers.find((u) => u.id === m.user_id)?.email,
  }));

  const typedDays = (days ?? []) as TripDayWithActivities[];

  return (
    <div className="min-h-screen bg-[#FFFBF5] flex flex-col">
      {/* Header Estilo "App Nativa" */}
      <div className="bg-[#FFFBF5]/80 backdrop-blur-md border-b border-orange-100/50 px-6 pt-12 pb-5 sticky top-0 z-30">
        <div className="flex items-start gap-4">
          {/* Botón de volver mejorado */}
          <Link
            href="/dashboard"
            className="mt-1 p-2 bg-white rounded-xl border border-orange-100 shadow-sm text-orange-600 active:scale-90 transition-all"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </Link>

          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight truncate">
              {trip.title}
            </h1>

            <div className="flex flex-col gap-1 mt-1">
              {trip.description && (
                <p className="text-sm font-medium text-slate-500 truncate leading-none">
                  {trip.description}
                </p>
              )}

              {/* Info adicional sutil */}
              <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar size={12} strokeWidth={2.5} />
                  {typedDays.length} {typedDays.length === 1 ? 'Día' : 'Días'}
                </span>
                <span className="w-1 h-1 bg-orange-200 rounded-full" />
                <span className="flex items-center gap-1">
                  <MapPin size={12} strokeWidth={2.5} />
                  Itinerario
                </span>
              </div>
            </div>
          </div>

          {/* MembersSheet usualmente es un trigger con avatares */}
          <div className="mt-1">
            <MembersSheet tripId={id} members={membersWithEmail} currentUserId={user.id} />
          </div>
        </div>
      </div>

      {/* Contenido principal con padding suave */}
      <main className="flex-1">
        <TripItinerary days={typedDays} tripId={id} />
      </main>
    </div>
  );
}
