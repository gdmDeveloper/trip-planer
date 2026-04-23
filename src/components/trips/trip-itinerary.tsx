'use client';

import { useState, useEffect, useRef } from 'react';
import { DaySelector } from './day-selector';
import { ActivityItem } from './activity-item';
import { AddActivitySheet } from './add-activity-sheet';
import { CalendarDays, Sparkles } from 'lucide-react';
import type { TripDayWithActivities } from '@/types/database';

interface TripItineraryProps {
  days: TripDayWithActivities[];
  tripId: string;
}

export function TripItinerary({ days, tripId }: TripItineraryProps) {
  const [selectedDayId, setSelectedDayId] = useState<string | null>(days[0]?.id ?? null);
  const [animKey, setAnimKey] = useState(0);
  const prevDayId = useRef<string | null>(null);

  const selectedDay = days.find((d) => d.id === selectedDayId);
  const selectedIndex = days.findIndex((d) => d.id === selectedDayId);
  const prevIndex = days.findIndex((d) => d.id === prevDayId.current);

  // Detect direction of swipe for the slide animation
  const direction = selectedIndex >= prevIndex ? 1 : -1;

  function handleSelect(id: string) {
    prevDayId.current = selectedDayId;
    setSelectedDayId(id);
    setAnimKey((k) => k + 1);
  }

  const activityCount = selectedDay?.activities?.length ?? 0;
  const formattedDate = selectedDay?.date
    ? new Date(selectedDay.date).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        background: '#F2F2F7',
        minHeight: 0,
      }}
    >
      {/* ── Day selector ──────────────────────────────────────────────── */}
      <DaySelector
        days={days}
        tripId={tripId}
        selectedDayId={selectedDayId}
        onSelect={handleSelect}
      />

      {/* ── Content area ──────────────────────────────────────────────── */}
      <div style={{ flex: 1, paddingBottom: 120, overflow: 'hidden' }}>
        {/* No days at all */}
        {!selectedDay ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 40px',
              textAlign: 'center',
              animation: 'scaleIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: 'white',
                border: '0.5px solid rgba(0,0,0,0.07)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                fontSize: 32,
              }}
            >
              🗓️
            </div>
            <p style={{ fontSize: 17, fontWeight: 600, color: '#0a0a0a', margin: 0 }}>
              Tu aventura comienza aquí
            </p>
            <p
              style={{
                fontSize: 14,
                color: '#8e8e93',
                marginTop: 6,
                lineHeight: 1.5,
                maxWidth: 240,
              }}
            >
              Añade tu primer día para organizar el itinerario.
            </p>
          </div>
        ) : (
          <div
            key={animKey}
            style={{
              animation: `slideInFrom${direction > 0 ? 'Right' : 'Left'} 0.32s cubic-bezier(0.25,0.46,0.45,0.94) both`,
            }}
          >
            {/* ── Day header card ──────────────────────────────────── */}
            <div style={{ padding: '20px 16px 12px' }}>
              <div
                style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: '16px 18px',
                  border: '0.5px solid rgba(0,0,0,0.07)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: '#0a0a0a',
                        letterSpacing: '-0.3px',
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {selectedDay.title}
                    </h2>
                    {formattedDate && (
                      <p
                        style={{
                          fontSize: 13,
                          color: '#8e8e93',
                          marginTop: 3,
                          textTransform: 'capitalize',
                        }}
                      >
                        {formattedDate}
                      </p>
                    )}
                  </div>

                  {/* Activity count badge */}
                  <div
                    style={{
                      background: activityCount > 0 ? '#EFF6FF' : '#F2F2F7',
                      borderRadius: 10,
                      padding: '4px 10px',
                      marginLeft: 12,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: activityCount > 0 ? '#3B82F6' : '#8e8e93',
                      }}
                    >
                      {activityCount} {activityCount === 1 ? 'actividad' : 'actividades'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Activities ───────────────────────────────────────── */}
            <div style={{ padding: '0 16px', position: 'relative' }}>
              {activityCount === 0 ? (
                /* Empty day state */
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    background: 'white',
                    borderRadius: 20,
                    border: '0.5px dashed rgba(0,0,0,0.12)',
                    textAlign: 'center',
                    animation: 'fadeIn 0.3s ease both',
                    animationDelay: '0.15s',
                  }}
                >
                  <span style={{ fontSize: 28, marginBottom: 10 }}>✨</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#3c3c43', margin: 0 }}>
                    Día libre
                  </p>
                  <p style={{ fontSize: 13, color: '#8e8e93', marginTop: 4 }}>
                    Toca el botón para añadir actividades.
                  </p>
                </div>
              ) : (
                /* Activity list with timeline */
                <div style={{ position: 'relative' }}>
                  {/* Timeline line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 23,
                      top: 20,
                      bottom: 20,
                      width: 1.5,
                      background: 'linear-gradient(to bottom, #DBEAFE, #BFDBFE 50%, transparent)',
                      borderRadius: 1,
                    }}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selectedDay.activities
                      .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'))
                      .map((activity, i) => (
                        <div
                          key={activity.id}
                          style={{
                            animation: 'slideUp 0.4s cubic-bezier(0.34,1.4,0.64,1) both',
                            animationDelay: `${i * 55}ms`,
                          }}
                        >
                          <ActivityItem activity={activity} tripId={tripId} />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── FAB for adding activities ──────────────────────────────────── */}
      {selectedDayId && <AddActivitySheet dayId={selectedDayId} tripId={tripId} />}

      <style>{`
        @keyframes slideInFromRight {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(14px); }
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
      `}</style>
    </div>
  );
}
