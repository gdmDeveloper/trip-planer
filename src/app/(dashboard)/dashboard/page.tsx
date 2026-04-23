import { createServerSupabaseClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { TripCard } from '@/components/trips/trip-card';
import { CreateTripSheet } from '@/components/trips/create-trip-sheet';
import { Map, Settings, Compass, Sparkles } from 'lucide-react';

// ─── Animation CSS ────────────────────────────────────────────────────────────
// Inject into your global CSS or a <style> tag in layout.tsx:
//
// @keyframes slideUp {
//   from { opacity: 0; transform: translateY(20px); }
//   to   { opacity: 1; transform: translateY(0); }
// }
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to   { opacity: 1; }
// }
// @keyframes scaleIn {
//   from { opacity: 0; transform: scale(0.92); }
//   to   { opacity: 1; transform: scale(1); }
// }
// .animate-slide-up   { animation: slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) both; }
// .animate-fade-in    { animation: fadeIn 0.4s ease both; }
// .animate-scale-in   { animation: scaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }
// ─────────────────────────────────────────────────────────────────────────────

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

  const firstName = user.user_metadata?.full_name?.split(' ')[0] ?? 'Viajero';
  const tripCount = trips?.length || 0;

  return (
    <div className="min-h-screen bg-[#F2F2F7] font-sans antialiased text-black selection:bg-blue-100">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 px-4 pt-14 pb-3"
        style={{
          background: 'rgba(242,242,247,0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '0.5px solid rgba(0,0,0,0.12)',
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Top row: date + avatar */}
          <div
            className="flex justify-between items-center mb-1 animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            <span className="text-[12px] font-semibold uppercase tracking-widest text-gray-400">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>

            {/* Avatar with subtle pulse ring */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-400 opacity-20 scale-110 animate-pulse" />
              <div
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md"
                style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
              >
                {firstName[0].toUpperCase()}
              </div>
            </div>
          </div>

          {/* Large title */}
          <h1
            className="text-[32px] font-bold tracking-tight text-black animate-slide-up"
            style={{ animationDelay: '60ms', letterSpacing: '-0.5px' }}
          >
            Mis Viajes
          </h1>
        </div>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────────── */}
      <main className="max-w-2xl mx-auto px-4 pt-6 pb-36">
        {/* Greeting widget */}
        <section className="mb-6 animate-slide-up" style={{ animationDelay: '120ms' }}>
          {/* Frosted glass greeting card */}
          <div
            className="rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF 0%, #EDE9FE 100%)',
              border: '0.5px solid rgba(99,102,241,0.15)',
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
            >
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-gray-900">Hola, {firstName} 👋</p>
              <p className="text-[13px] text-gray-500 leading-tight mt-0.5">
                {tripCount === 0
                  ? 'Empieza tu primera aventura hoy.'
                  : tripCount === 1
                    ? 'Tienes 1 destino en tu lista.'
                    : `Tienes ${tripCount} destinos en tu lista.`}
              </p>
            </div>
          </div>
        </section>

        {/* Section header */}
        {trips && trips.length > 0 && (
          <div
            className="flex justify-between items-baseline mb-3 animate-fade-in"
            style={{ animationDelay: '180ms' }}
          >
            <h2 className="text-[17px] font-semibold text-gray-900">Próximas aventuras</h2>
            <span className="text-[13px] font-medium text-blue-500">{tripCount} total</span>
          </div>
        )}

        {/* Trip list */}
        <div className="space-y-3">
          {trips && trips.length > 0 ? (
            trips.map((trip, i) => (
              <div
                key={trip.id}
                className="animate-scale-in active:scale-[0.98] transition-transform duration-150 cursor-pointer"
                style={{
                  animationDelay: `${200 + i * 70}ms`,
                  /* Each card: white bg, soft shadow, generous radius */
                  borderRadius: '20px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                }}
              >
                <TripCard trip={trip} index={i} />
              </div>
            ))
          ) : (
            /* ── Empty state ──────────────────────────────────────────────── */
            <div
              className="flex flex-col items-center justify-center py-20 px-8 text-center animate-scale-in"
              style={{
                animationDelay: '200ms',
                background: 'white',
                borderRadius: '28px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
                border: '0.5px solid rgba(0,0,0,0.06)',
              }}
            >
              {/* Animated compass icon */}
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-inner"
                style={{ background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' }}
              >
                <Compass
                  size={36}
                  className="text-blue-500"
                  style={{ animation: 'spin 8s linear infinite' }}
                />
              </div>
              <h3 className="text-[17px] font-semibold text-gray-900">Sin aventuras aún</h3>
              <p className="text-[14px] text-gray-400 mt-1.5 leading-relaxed max-w-[220px]">
                Toca el botón para empezar a planear tu próximo destino.
              </p>

              {/* Subtle CTA hint */}
              <div className="mt-5 flex items-center gap-1.5 text-blue-500">
                <div
                  className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                  style={{ fontSize: 14, color: 'white', lineHeight: 1 }}
                >
                  +
                </div>
                <span className="text-[13px] font-medium">Crear viaje</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Bottom Tab Bar ──────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up"
        style={{
          animationDelay: '300ms',
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          borderTop: '0.5px solid rgba(0,0,0,0.10)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div className="max-w-md mx-auto h-20 flex items-center justify-around px-8">
          {/* Tab: Explorar (active) */}
          <button
            className="flex flex-col items-center gap-0.5 text-blue-500 active:scale-90 transition-transform duration-150"
            aria-label="Explorar"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(59,130,246,0.1)' }}
            >
              <Map size={18} />
            </div>
            <span className="text-[10px] font-semibold">Explorar</span>
          </button>

          {/* FAB: Crear viaje */}
          <div className="relative -top-5">
            {/* Glow ring behind the button */}
            <div
              className="absolute inset-0 rounded-full opacity-40 blur-md scale-110"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
            />
            <div
              className="relative active:scale-95 transition-transform duration-150"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(99,102,241,0.45))' }}
            >
              <CreateTripSheet />
            </div>
          </div>

          {/* Tab: Ajustes */}
          <button
            className="flex flex-col items-center gap-0.5 text-gray-400 active:scale-90 transition-transform duration-150"
            aria-label="Ajustes"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center">
              <Settings size={18} />
            </div>
            <span className="text-[10px] font-semibold">Ajustes</span>
          </button>
        </div>
      </div>

      {/* ── Inline keyframes (fallback if not in global CSS) ──────────────── */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-slide-up  { animation: slideUp  0.52s cubic-bezier(0.34,1.4,0.64,1) both; }
        .animate-fade-in   { animation: fadeIn   0.4s ease both; }
        .animate-scale-in  { animation: scaleIn  0.48s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>
    </div>
  );
}
