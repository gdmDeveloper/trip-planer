'use client';

import { useState } from 'react';
import { DaySelector } from './day-selector';
import { ActivityItem } from './activity-item';
import { AddActivitySheet } from './add-activity-sheet';
import { CalendarDays, Sparkles } from 'lucide-react'; // Para estados vacíos
import type { TripDayWithActivities } from '@/types/database';

interface TripItineraryProps {
  days: TripDayWithActivities[];
  tripId: string;
}

export function TripItinerary({ days, tripId }: TripItineraryProps) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(days[0]?.id ?? null);

  const selectedDay = days.find((d) => d.id === selectedDayId);

  return (
    <div className="flex flex-col flex-1 bg-[#FFFBF5]">
      <DaySelector
        days={days}
        tripId={tripId}
        selectedDayId={selectedDayId}
        onSelect={setSelectedDayId}
      />

      <div className="flex-1 pb-32">
        {!selectedDay ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-10">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
              <CalendarDays className="text-orange-500" size={32} />
            </div>
            <p className="font-bold text-slate-900 text-lg">Tu aventura comienza aquí</p>
            <p className="text-sm text-slate-500 mt-1">
              Añade tu primer día para organizar el viaje.
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header del Día */}
            <div className="px-6 pt-8 pb-6">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {selectedDay.title}
              </h2>
              {selectedDay.date && (
                <div className="flex items-center gap-2 mt-1 text-orange-500 font-bold text-[11px] uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  {new Date(selectedDay.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </div>
              )}
            </div>

            {/* Listado de Actividades con línea de tiempo sutil */}
            <div className="px-6 space-y-4 relative">
              {/* Línea vertical decorativa opcional */}
              <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-orange-100/50 -z-10" />

              {selectedDay.activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-[2rem] border-2 border-dashed border-orange-100">
                  <Sparkles className="text-orange-300 mb-2" size={24} />
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                    Día libre
                  </p>
                </div>
              ) : (
                selectedDay.activities
                  .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                  .map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} tripId={tripId} />
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedDayId && <AddActivitySheet dayId={selectedDayId} tripId={tripId} />}
    </div>
  );
}
