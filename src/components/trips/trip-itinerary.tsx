'use client';

import { useState } from 'react';
import { DaySelector } from './day-selector';
import { ActivityItem } from './activity-item';
import { AddActivitySheet } from './add-activity-sheet';
import type { TripDayWithActivities } from '@/types/database';

interface TripItineraryProps {
  days: TripDayWithActivities[];
  tripId: string;
}

export function TripItinerary({ days, tripId }: TripItineraryProps) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(days[0]?.id ?? null);

  const selectedDay = days.find((d) => d.id === selectedDayId);

  return (
    <div className="flex flex-col flex-1">
      <DaySelector
        days={days}
        tripId={tripId}
        selectedDayId={selectedDayId}
        onSelect={setSelectedDayId}
      />

      {/* Actividades */}
      <div className="flex-1 pb-24">
        {!selectedDay ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-3xl mb-3">📅</p>
            <p className="font-medium text-slate-600">Sin días todavía</p>
            <p className="text-sm mt-1">Pulsa + para añadir el primer día</p>
          </div>
        ) : selectedDay.activities.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <p className="text-3xl mb-3">✏️</p>
            <p className="font-medium text-slate-600">Día vacío</p>
            <p className="text-sm mt-1">Pulsa + para añadir una actividad</p>
          </div>
        ) : (
          <div>
            <div className="px-4 pt-4 pb-2">
              <p className="font-medium text-slate-900">{selectedDay.title}</p>
              {selectedDay.date && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {new Date(selectedDay.date).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </p>
              )}
            </div>
            {selectedDay.activities
              .sort((a, b) => a.order_index - b.order_index)
              .map((activity) => (
                <ActivityItem key={activity.id} activity={activity} tripId={tripId} />
              ))}
          </div>
        )}
      </div>

      {selectedDayId && <AddActivitySheet dayId={selectedDayId} tripId={tripId} />}
    </div>
  );
}
