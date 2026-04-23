import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAdminClient } from '@/lib/supabase-admin';
import { redirect } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import Link from 'next/link';
import { TripItinerary } from '@/components/trips/trip-itinerary';
import { MembersSheet } from '@/components/trips/members-sheet';
import type { TripDayWithActivities } from '@/types/database';

interface TripPageProps {
  params: Promise<{ id: string }>;
}

// Activity count helper
function totalActivities(days: TripDayWithActivities[]) {
  return days.reduce((sum, d) => sum + (d.activities?.length ?? 0), 0);
}

// Date range helper — "12 abr – 18 abr"
function dateRange(trip: { start_date?: string | null; end_date?: string | null }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  if (trip.start_date && trip.end_date) return `${fmt(trip.start_date)} – ${fmt(trip.end_date)}`;
  if (trip.start_date) return fmt(trip.start_date);
  return null;
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
  const activityCount = totalActivities(typedDays);
  const range = dateRange(trip);
  const memberCount = membersWithEmail.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F2F7] font-sans antialiased">
      {/* ── Sticky header ──────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 animate-fade-in"
        style={{
          backgroundColor: 'rgba(242,242,247,0.85)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '0.5px solid rgba(0,0,0,0.10)',
          paddingTop: 56,
          paddingBottom: 14,
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        <div className="max-w-2xl mx-auto">
          {/* Row 1: back + members */}
          <div className="flex items-center justify-between mb-3">
            <Link
              href="/dashboard"
              className="active:scale-90 transition-transform duration-150"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                color: '#007AFF',
                fontSize: 17,
                fontWeight: 400,
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={20} strokeWidth={2.5} style={{ color: '#007AFF' }} />
              <span>Viajes</span>
            </Link>

            <div className="animate-scale-in" style={{ animationDelay: '120ms' }}>
              <MembersSheet tripId={id} members={membersWithEmail} currentUserId={user.id} />
            </div>
          </div>

          {/* Row 2: large title */}
          <h1
            className="animate-slide-up"
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              color: '#0a0a0a',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              animationDelay: '40ms',
            }}
          >
            {trip.title}
          </h1>

          {trip.description && (
            <p
              className="animate-fade-in"
              style={{
                fontSize: 15,
                color: '#8e8e93',
                margin: '3px 0 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                animationDelay: '80ms',
              }}
            >
              {trip.description}
            </p>
          )}

          {/* Row 3: stat pills */}
          <div
            className="animate-fade-in"
            style={{
              display: 'flex',
              gap: 6,
              marginTop: 10,
              flexWrap: 'wrap',
              animationDelay: '120ms',
            }}
          >
            {range && <StatPill icon={<Calendar size={11} strokeWidth={2.5} />} label={range} />}
            <StatPill
              icon={<MapPin size={11} strokeWidth={2.5} />}
              label={`${typedDays.length} ${typedDays.length === 1 ? 'día' : 'días'}`}
            />
            {activityCount > 0 && (
              <StatPill
                icon={<span style={{ fontSize: 11 }}>⚡</span>}
                label={`${activityCount} ${activityCount === 1 ? 'actividad' : 'actividades'}`}
              />
            )}
            {memberCount > 0 && (
              <StatPill
                icon={<Users size={11} strokeWidth={2.5} />}
                label={`${memberCount} ${memberCount === 1 ? 'viajero' : 'viajeros'}`}
              />
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-2xl mx-auto w-full">
        <TripItinerary days={typedDays} tripId={id} />
      </main>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up  { animation: slideUp  0.45s cubic-bezier(0.34,1.4,0.64,1) both; }
        .animate-fade-in   { animation: fadeIn   0.35s ease both; }
        .animate-scale-in  { animation: scaleIn  0.4s  cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>
    </div>
  );
}

// ── Stat pill sub-component ────────────────────────────────────────────────────
function StatPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(116,116,128,0.12)',
        borderRadius: 20,
        padding: '3px 9px',
        fontSize: 12,
        fontWeight: 500,
        color: '#3c3c43',
      }}
    >
      {icon}
      {label}
    </span>
  );
}
