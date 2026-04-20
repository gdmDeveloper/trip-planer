'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Users, Calendar, ChevronRight } from 'lucide-react';
import { deleteTrip } from '@/app/actions/trips';
import type { Trip } from '@/types/database';
import { useDaysLeft } from '@/hooks/use-days-left';

const COLORS = ['bg-orange-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-600'];

interface TripCardProps {
  trip: Trip & { trip_members: { user_id: string }[] };
  index: number;
}

export function TripCard({ trip, index }: TripCardProps) {
  const [deleting, setDeleting] = useState(false);
  const colorClass = COLORS[index % COLORS.length];
  console.log(trip);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('¿Eliminar viaje?')) return;
    setDeleting(true);
    await deleteTrip(trip.id);
  }

  const formatDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) : '--';

  return (
    <Link href={`/dashboard/trips/${trip.id}`} className="block group">
      <div className="bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-orange-100/40 flex items-center gap-4 active:scale-[0.98] transition-all duration-200">
        {/* Indicador de color minimalista */}
        <div
          className={`shrink-0 w-16 h-16 ${colorClass} rounded-2xl flex flex-col items-center justify-center text-white shadow-sm ring-4 ring-orange-50/50`}
        >
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
            {new Date(trip.start_date || '')
              .toLocaleDateString('es-ES', { month: 'short' })
              .replace('.', '')}
          </span>
          <span className="text-xl font-black leading-none">
            {new Date(trip.start_date || '').getDate() || '—'}
          </span>
        </div>

        {/* Información con tipografía profesional */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <h3 className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight truncate">
                {trip.title}
              </h3>
              {trip.description ? (
                <p className="text-xs font-medium text-slate-500 line-clamp-1">
                  {trip.description}
                </p>
              ) : (
                <p className="text-[11px] font-medium text-orange-400/80 uppercase tracking-wider">
                  Sin descripción
                </p>
              )}
            </div>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1 text-slate-300 hover:text-rose-500 transition-colors ml-2"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Metadata Footer */}
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <Users size={12} className="text-slate-400" />
                {trip.trip_members?.length || 0}
              </div>
              {/* Contador de días */}
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">
                {useDaysLeft(trip.start_date)}
              </span>
            </div>

            <ChevronRight
              size={18}
              className="text-slate-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
