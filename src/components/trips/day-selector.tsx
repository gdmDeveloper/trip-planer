'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { createDay } from '@/app/actions/days';
import type { TripDayWithActivities } from '@/types/database';

interface DaySelectorProps {
  days: TripDayWithActivities[];
  tripId: string;
  selectedDayId: string | null;
  onSelect: (dayId: string) => void;
}

export function DaySelector({ days, tripId, selectedDayId, onSelect }: DaySelectorProps) {
  const [isPending, startTransition] = useTransition();

  function handleAddDay() {
    startTransition(async () => {
      const day = await createDay(tripId);
      if (day) onSelect(day.id);
    });
  }

  return (
    <div className="flex items-center gap-3 px-6 py-4 overflow-x-auto bg-[#FFFBF5] no-scrollbar active:cursor-grabbing">
      {days.map((day) => {
        const isActive = selectedDayId === day.id;
        return (
          <button
            key={day.id}
            onClick={() => onSelect(day.id)}
            className={`
              shrink-0 min-w-[70px] h-12 flex flex-col items-center justify-center rounded-2xl transition-all duration-300
              ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105'
                  : 'bg-white text-slate-500 border border-orange-100/50 hover:bg-orange-50'
              }
            `}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-orange-100' : 'text-slate-400'}`}
            >
              Día
            </span>
            <span className="text-sm font-black leading-none mt-0.5">{day.day_number}</span>
          </button>
        );
      })}

      {/* Botón Añadir Día con diseño circular minimalista */}
      <button
        onClick={handleAddDay}
        disabled={isPending}
        className={`
          shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all
          ${
            isPending
              ? 'bg-orange-50 opacity-50'
              : 'bg-white border-2 border-dashed border-orange-200 text-orange-400 hover:border-orange-400 hover:text-orange-500 active:scale-90'
          }
        `}
      >
        <Plus size={20} strokeWidth={3} className={isPending ? 'animate-spin' : ''} />
      </button>

      {/* Spacer final para que el último elemento no quede pegado al borde al scrollear */}
      <div className="shrink-0 w-6 h-1" />
    </div>
  );
}
