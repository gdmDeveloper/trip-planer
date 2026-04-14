import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TripCard } from '@/components/trips/trip-card';
import { CreateTripSheet } from '@/components/trips/create-trip-sheet';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: trips } = await supabase
    .from('trips')
    .select('*, trip_members!inner(user_id)')
    .order('created_at', { ascending: false });

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'viajero';

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">Mis viajes</h1>
            <p className="text-xs text-slate-500">
              {trips?.length
                ? `${trips.length} ${trips.length === 1 ? 'viaje' : 'viajes'}`
                : 'Sin viajes aún'}
            </p>
          </div>
          <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-sm font-medium text-violet-700">
            {firstName[0].toUpperCase()}
          </div>
        </div>
      </div>

      {/* Trips */}
      <div className="px-4 pt-4 pb-32 space-y-3">
        {trips && trips.length > 0 ? (
          trips.map((trip, i) => <TripCard key={trip.id} trip={trip} index={i} />)
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p className="text-4xl mb-3">🗾</p>
            <p className="font-medium text-slate-600">Sin viajes todavía</p>
            <p className="text-sm mt-1">Pulsa el + para crear tu primer viaje</p>
          </div>
        )}
      </div>

      <CreateTripSheet />
    </div>
  );
}
