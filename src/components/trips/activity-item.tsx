'use client';

import { useTransition } from 'react';
import { Trash2, Star } from 'lucide-react';
import { toggleFavorite, deleteActivity } from '@/app/actions/activities';
import type { Activity } from '@/types/database';

interface ActivityItemProps {
  activity: Activity;
  tripId: string;
}

const DOT_COLORS = ['bg-violet-500', 'bg-teal-500', 'bg-orange-400', 'bg-blue-500'];

export function ActivityItem({ activity, tripId }: ActivityItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggleFavorite() {
    startTransition(() => toggleFavorite(activity.id, tripId, activity.is_favorite));
  }

  function handleDelete() {
    if (!confirm('¿Eliminar actividad?')) return;
    startTransition(() => deleteActivity(activity.id, tripId));
  }

  const dotColor = DOT_COLORS[activity.order_index % DOT_COLORS.length];

  return (
    <div
      className={`flex gap-3 py-3 px-4 border-b border-slate-100 ${isPending ? 'opacity-50' : ''}`}
    >
      {/* Hora */}
      <div className="w-12 text-xs text-slate-400 pt-0.5 shrink-0">
        {activity.time ? activity.time.slice(0, 5) : '—'}
      </div>

      {/* Dot */}
      <div className={`w-2 h-2 rounded-full ${dotColor} mt-1.5 shrink-0`} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 leading-snug">{activity.title}</p>
        {activity.place && <p className="text-xs text-slate-400 mt-0.5">{activity.place}</p>}
        {activity.notes && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{activity.notes}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-start gap-1 shrink-0">
        <button
          onClick={handleToggleFavorite}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Star
            size={15}
            className={activity.is_favorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
          />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <Trash2 size={15} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
}
