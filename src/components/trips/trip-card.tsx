'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Users, ChevronRight, MapPin, Clock } from 'lucide-react';
import { deleteTrip } from '@/app/actions/trips';
import type { Trip } from '@/types/database';
import { useDaysLeft } from '@/hooks/use-days-left';

interface TripCardProps {
  trip: Trip & { trip_members: { user_id: string }[] };
  index: number;
}

// Destination emoji map — cycles through a curated set per card index
const DESTINATION_ICONS = ['✈️', '🗼', '🏝️', '🏔️', '🌸', '🗺️', '🏯', '🌊'];

export function TripCard({ trip, index }: TripCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const daysLeft = useDaysLeft(trip.start_date);

  const icon = DESTINATION_ICONS[index % DESTINATION_ICONS.length];
  const memberCount = trip.trip_members?.length || 0;
  const isToday = daysLeft.includes('hoy');
  const isSoon = daysLeft.includes('día') && parseInt(daysLeft) <= 7;

  const dateFormatted = trip.start_date
    ? new Date(trip.start_date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
      })
    : null;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }

  async function confirmDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    await deleteTrip(trip.id);
  }

  return (
    <>
      <Link
        href={`/dashboard/trips/${trip.id}`}
        className="block group"
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '20px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            border: '0.5px solid rgba(0,0,0,0.07)',
            boxShadow: pressed
              ? '0 1px 4px rgba(0,0,0,0.04)'
              : '0 2px 12px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.04)',
            transform: pressed ? 'scale(0.985)' : 'scale(1)',
            transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
            willChange: 'transform',
            opacity: deleting ? 0.4 : 1,
          }}
        >
          {/* ── Destination icon ─────────────────────────────────────── */}
          <div
            style={{
              flexShrink: 0,
              width: 50,
              height: 50,
              borderRadius: 14,
              background: 'linear-gradient(145deg, #EFF6FF 0%, #DBEAFE 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
              border: '0.5px solid rgba(59,130,246,0.12)',
            }}
          >
            {icon}
          </div>

          {/* ── Main content ─────────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Title + date */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 8,
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#0a0a0a',
                  letterSpacing: '-0.3px',
                  lineHeight: 1.2,
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {trip.title}
              </h3>
              {dateFormatted && (
                <span
                  style={{
                    fontSize: 13,
                    color: '#8e8e93',
                    fontWeight: 400,
                    flexShrink: 0,
                  }}
                >
                  {dateFormatted}
                </span>
              )}
            </div>

            {/* Description */}
            <p
              style={{
                fontSize: 14,
                color: '#8e8e93',
                margin: '2px 0 0',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {trip.description || 'Sin descripción'}
            </p>

            {/* ── Metadata pills ────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 7 }}>
              {/* Members pill */}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  background: '#F2F2F7',
                  borderRadius: 20,
                  padding: '2px 8px',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#3c3c43',
                }}
              >
                <Users size={11} strokeWidth={2.5} />
                {memberCount}
              </span>

              {/* Days left pill — changes color by urgency */}
              {daysLeft && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    background: isToday ? '#FFF1F0' : isSoon ? '#FFFBEB' : '#F2F2F7',
                    borderRadius: 20,
                    padding: '2px 8px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: isToday ? '#FF3B30' : isSoon ? '#FF9500' : '#8e8e93',
                    transition: 'background 0.3s ease',
                  }}
                >
                  <Clock size={11} strokeWidth={2.5} />
                  {daysLeft}
                </span>
              )}
            </div>
          </div>

          {/* ── Right actions ──────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {/* Delete button — visible on hover (desktop) */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="hidden md:flex"
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: 'none',
                background: 'transparent',
                display: 'none', // overridden by md:flex via Tailwind
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c7c7cc',
                cursor: 'pointer',
                transition: 'color 0.2s ease, background 0.2s ease',
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#FF3B30';
                (e.currentTarget as HTMLButtonElement).style.background = '#FFF1F0';
                (e.currentTarget as HTMLButtonElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = '#c7c7cc';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.opacity = '0';
              }}
            >
              <Trash2 size={15} strokeWidth={2} />
            </button>

            {/* iOS chevron */}
            <ChevronRight size={18} strokeWidth={3} style={{ color: '#c7c7cc' }} />
          </div>
        </div>
      </Link>

      {/* ── Delete confirmation sheet ───────────────────────────────── */}
      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease both',
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#F2F2F7',
              borderRadius: '20px 20px 0 0',
              padding: '8px 16px 32px',
              animation: 'slideUp 0.35s cubic-bezier(0.34,1.2,0.64,1) both',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'rgba(60,60,67,0.3)',
                margin: '8px auto 20px',
              }}
            />

            {/* Title */}
            <p
              style={{
                fontSize: 13,
                color: '#8e8e93',
                textAlign: 'center',
                marginBottom: 8,
                fontWeight: 400,
              }}
            >
              ¿Eliminar <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{trip.title}</strong>?
            </p>
            <p
              style={{
                fontSize: 13,
                color: '#8e8e93',
                textAlign: 'center',
                marginBottom: 16,
              }}
            >
              Esta acción no se puede deshacer.
            </p>

            {/* Action sheet buttons */}
            <button
              onClick={confirmDelete}
              disabled={deleting}
              style={{
                width: '100%',
                height: 56,
                borderRadius: 14,
                background: 'white',
                border: 'none',
                fontSize: 17,
                fontWeight: 600,
                color: '#FF3B30',
                cursor: 'pointer',
                marginBottom: 8,
                transition: 'opacity 0.15s ease',
              }}
            >
              {deleting ? 'Eliminando...' : 'Eliminar viaje'}
            </button>

            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                width: '100%',
                height: 56,
                borderRadius: 14,
                background: 'white',
                border: 'none',
                fontSize: 17,
                fontWeight: 600,
                color: '#007AFF',
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        .group:hover .md\\:flex { opacity: 1 !important; }
      `}</style>
    </>
  );
}
