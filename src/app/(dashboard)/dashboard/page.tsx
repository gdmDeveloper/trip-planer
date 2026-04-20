import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TripCard } from '@/components/trips/trip-card';
import { CreateTripSheet } from '@/components/trips/create-trip-sheet';
import { Map, Sparkles, PalmtreeIcon } from 'lucide-react'; // Iconos sugeridos

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
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header Mobile First */}
      <header className="sticky top-0 z-30 bg-[#FFFBF5]/90 backdrop-blur-md px-6 pt-10 pb-6 border-b border-orange-100/30">
        <div className="flex flex-col gap-6">
          {/* Logo / Nombre de la App */}
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-orange-500 to-rose-500 p-1.5 rounded-lg shadow-sm">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="text-xl font-black tracking-tighter text-orange-950 font-serif italic">
              Trip<span className="text-orange-500 not-italic font-sans">Planner</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-orange-950">¡Hola, {firstName}!</h1>
                <span className="text-2xl">👋</span>
              </div>
              <p className="text-sm font-medium text-orange-800/60 flex items-center gap-1.5">
                <Map size={14} className="text-orange-400" />
                {trips?.length
                  ? `${trips.length} ${trips.length === 1 ? 'destino guardado' : 'destinos guardados'}`
                  : '¿A dónde vamos hoy?'}
              </p>
            </div>

            {/* Avatar estilo Sunset */}
            <div className="w-11 h-11 rounded-full bg-linear-to-tr from-orange-400 to-rose-400 p-0.5 shadow-lg shadow-orange-200">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-sm font-bold text-orange-600">
                {firstName[0].toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Listado de Viajes */}
      <main className="px-6 pt-6 pb-32">
        <div className="flex flex-col gap-5">
          {trips && trips.length > 0 ? (
            trips.map((trip, i) => (
              <div key={trip.id} className="transform transition-all active:scale-[0.98]">
                <TripCard trip={trip} index={i} />
              </div>
            ))
          ) : (
            /* Empty State Mejorado */
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white/50 rounded-[2.5rem] border-2 border-dashed border-orange-100">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                <PalmtreeIcon className="text-orange-500" size={40} />
              </div>
              <h2 className="text-xl font-bold text-orange-950 mb-2">Prepara las maletas</h2>
              <p className="text-orange-800/60 text-sm leading-relaxed">
                Aún no tienes ningún viaje planeado. <br />
                ¡Pulsa el botón de abajo y empieza tu aventura!
              </p>
            </div>
          )}
        </div>
      </main>
      {/* Componente del botón flotante (asegúrate que tenga el diseño Sunset) */}
      <CreateTripSheet />
    </div>
  );
}
