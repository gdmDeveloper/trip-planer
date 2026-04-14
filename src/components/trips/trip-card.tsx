'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Users, CalendarDays } from 'lucide-react';
import { deleteTrip } from '@/app/actions/trips';
import type { Trip } from '@/types/database';

const GRADIENTS = [
  'from-violet-500 to-teal-400',
  'from-teal-500 to-blue-400',
  'from-orange-400 to-pink-500',
  'from-blue-500 to-violet-400',
];

interface TripCardProps {
  trip: Trip & { trip_members: { user_id: string }[] };
  index: number;
}

export function TripCard({ trip, index }: TripCardProps) {
  const [deleting, setDeleting] = useState(false);
  const gradient = GRADIENTS[index % GRADIENTS.length];

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Eliminar este viaje?')) return;
    setDeleting(true);
    await deleteTrip(trip.id);
  }

  const memberCount = trip.trip_members?.length ?? 0;
  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : null;

  return (
    <Link href={`/dashboard/trips/${trip.id}`}>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden active:scale-[0.98] transition-transform">
        {/* Cover */}
        <div className={`h-28 bg-linear-to-br ${gradient} relative`}>
          {trip.start_date && (
            <span className="absolute bottom-2 left-3 text-xs text-white/90 bg-black/20 px-2 py-0.5 rounded-full">
              {formatDate(trip.start_date)}
              {trip.end_date && ` → ${formatDate(trip.end_date)}`}
            </span>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="absolute top-2 right-2 p-1.5 bg-black/20 rounded-full text-white/80 hover:bg-black/40 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-3">
          <p className="font-medium text-slate-900 text-sm leading-snug">{trip.title}</p>
          {trip.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{trip.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            {memberCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Users size={12} />
                {memberCount} {memberCount === 1 ? 'persona' : 'personas'}
              </span>
            )}
            {trip.start_date && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays size={12} />
                {formatDate(trip.start_date)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
