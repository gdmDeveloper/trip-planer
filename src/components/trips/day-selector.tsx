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
    <div className="flex gap-2 px-4 py-3 overflow-x-auto border-b border-slate-200 bg-white scrollbar-none">
      {days.map((day) => (
        <button
          key={day.id}
          onClick={() => onSelect(day.id)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            selectedDayId === day.id ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'
          }`}
        >
          Día {day.day_number}
        </button>
      ))}
      <button
        onClick={handleAddDay}
        disabled={isPending}
        className="shrink-0 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
