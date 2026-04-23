'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to keep selected day visible
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [selectedDayId]);

  function handleAddDay() {
    startTransition(async () => {
      const day = await createDay(tripId);
      if (day) onSelect(day.id);
    });
  }

  return (
    <div
      style={{
        background: 'rgba(242,242,247,0.95)',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        paddingTop: 12,
        paddingBottom: 12,
      }}
    >
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingLeft: 16,
          paddingRight: 16,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        className="no-scrollbar"
      >
        {days.map((day, i) => {
          const isActive = selectedDayId === day.id;

          // Format short date label if available
          const shortDate = day.date
            ? new Date(day.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            : null;

          return (
            <button
              key={day.id}
              ref={isActive ? activeRef : null}
              onClick={() => onSelect(day.id)}
              style={{
                flexShrink: 0,
                minWidth: shortDate ? 72 : 58,
                height: 56,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                borderRadius: 16,
                border: isActive ? 'none' : '0.5px solid rgba(0,0,0,0.08)',
                background: isActive ? '#007AFF' : 'white',
                boxShadow: isActive
                  ? '0 4px 14px rgba(0,122,255,0.35)'
                  : '0 1px 4px rgba(0,0,0,0.05)',
                transform: isActive ? 'scale(1.06)' : 'scale(1)',
                transition:
                  'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease, background 0.2s ease',
                cursor: 'pointer',
                padding: '0 12px',
                animation: `pillFadeIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both`,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isActive ? 'rgba(255,255,255,0.7)' : '#8e8e93',
                  lineHeight: 1,
                }}
              >
                Día
              </span>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: isActive ? 'white' : '#0a0a0a',
                  lineHeight: 1,
                  letterSpacing: '-0.5px',
                }}
              >
                {day.day_number}
              </span>
              {shortDate && (
                <span
                  style={{
                    fontSize: 10,
                    color: isActive ? 'rgba(255,255,255,0.6)' : '#c7c7cc',
                    lineHeight: 1,
                    marginTop: 1,
                  }}
                >
                  {shortDate}
                </span>
              )}
            </button>
          );
        })}

        {/* ── Add day button ─────────────────────────────────────── */}
        <button
          onClick={handleAddDay}
          disabled={isPending}
          style={{
            flexShrink: 0,
            width: 56,
            height: 56,
            borderRadius: 16,
            border: '1.5px dashed rgba(0,122,255,0.3)',
            background: isPending ? 'rgba(0,122,255,0.05)' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isPending ? 'not-allowed' : 'pointer',
            transition: 'transform 0.15s ease, border-color 0.2s ease, background 0.2s ease',
            opacity: isPending ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isPending) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,122,255,0.6)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,122,255,0.07)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,122,255,0.3)';
            (e.currentTarget as HTMLButtonElement).style.background = isPending
              ? 'rgba(0,122,255,0.05)'
              : 'transparent';
          }}
          onMouseDown={(e) => {
            if (!isPending) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.9)';
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          }}
        >
          <Plus
            size={20}
            strokeWidth={2.5}
            style={{
              color: '#007AFF',
              animation: isPending ? 'spin 0.8s linear infinite' : 'none',
            }}
          />
        </button>

        {/* Scroll spacer */}
        <div style={{ flexShrink: 0, width: 4 }} />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        @keyframes pillFadeIn {
          from { opacity: 0; transform: scale(0.8) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
