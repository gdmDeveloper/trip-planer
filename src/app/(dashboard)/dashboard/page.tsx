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
      {/* Contenedor del Header tipo "Cajón/Isla" */}
      <div className="sticky top-0 z-30 px-4 pt-4">
        <header className="bg-white/80 backdrop-blur-xl border border-orange-100/50 rounded-[2.5rem] px-6 py-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col gap-5">
            {/* Logo Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-linear-to-br from-orange-500 to-rose-500 p-1.5 rounded-xl shadow-sm">
                  <Sparkles className="text-white" size={14} />
                </div>
                <span className="text-lg font-black tracking-tighter text-orange-950 font-serif italic">
                  Trip<span className="text-orange-500 not-italic font-sans">Planner</span>
                </span>
              </div>

              {/* Badge de contador de viajes - Muy de app moderna */}
              <div className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  {trips?.length || 0} Viajes
                </p>
              </div>
            </div>

            {/* Profile Row */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  ¡Hola, {firstName}! 👋
                </h1>
                <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Map size={12} className="text-orange-400" />
                  ¿Cuál es el próximo destino?
                </p>
              </div>

              {/* Avatar con anillo de progreso o diseño premium */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-orange-400 to-rose-400 p-0.5 rotate-3 shadow-md">
                  <div className="w-full h-full rounded-[14px] bg-white flex items-center justify-center text-sm font-black text-orange-600 -rotate-3">
                    {firstName[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>
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
