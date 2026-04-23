'use client';

import { useState, useTransition } from 'react';
import { Trash2, Star, MapPin, Clock, FileText } from 'lucide-react';
import { toggleFavorite, deleteActivity } from '@/app/actions/activities';
import { EditActivitySheet } from './edit-activity-sheet';
import type { Activity } from '@/types/database';

interface ActivityItemProps {
  activity: Activity;
  tripId: string;
}

// Category color system — maps order_index to an accent
const ACCENTS = [
  { dot: '#8B5CF6', bg: '#F5F3FF', text: '#6D28D9' }, // violet
  { dot: '#14B8A6', bg: '#F0FDFA', text: '#0F766E' }, // teal
  { dot: '#F97316', bg: '#FFF7ED', text: '#C2410C' }, // orange
  { dot: '#3B82F6', bg: '#EFF6FF', text: '#1D4ED8' }, // blue
  { dot: '#EC4899', bg: '#FDF2F8', text: '#BE185D' }, // pink
];

export function ActivityItem({ activity, tripId }: ActivityItemProps) {
  const [isPending, startTransition] = useTransition();
  const [starPressed, setStarPressed] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const accent = ACCENTS[activity.order_index % ACCENTS.length];

  function handleToggleFavorite() {
    setStarPressed(true);
    setTimeout(() => setStarPressed(false), 300);
    startTransition(() => toggleFavorite(activity.id, tripId, activity.is_favorite));
  }

  async function confirmDelete() {
    setShowDelete(false);
    startTransition(() => deleteActivity(activity.id, tripId));
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          gap: 0,
          opacity: isPending ? 0.45 : 1,
          transition: 'opacity 0.2s ease',
          borderRadius: 18,
          overflow: 'hidden',
          background: 'white',
          border: '0.5px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
        }}
      >
        {/* ── Colored left accent bar ──────────────────────────── */}
        <div
          style={{
            width: 4,
            flexShrink: 0,
            background: accent.dot,
            borderRadius: '18px 0 0 18px',
          }}
        />

        {/* ── Time column ──────────────────────────────────────── */}
        <div
          style={{
            width: 52,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 14,
            gap: 3,
            borderRight: '0.5px solid rgba(0,0,0,0.05)',
          }}
        >
          {activity.time ? (
            <>
              <Clock size={11} style={{ color: accent.dot, flexShrink: 0 }} strokeWidth={2.5} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: accent.text,
                  letterSpacing: '-0.2px',
                  textAlign: 'center',
                  lineHeight: 1.1,
                }}
              >
                {activity.time.slice(0, 5)}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 13, color: '#c7c7cc' }}>–</span>
          )}
        </div>

        {/* ── Main content ─────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, padding: '12px 12px 12px 14px' }}>
          {/* Title + favorite */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <p
              style={{
                flex: 1,
                fontSize: 15,
                fontWeight: 600,
                color: '#0a0a0a',
                lineHeight: 1.3,
                margin: 0,
                letterSpacing: '-0.2px',
              }}
            >
              {activity.title}
            </p>

            {/* Star button */}
            <button
              onClick={handleToggleFavorite}
              style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 'none',
                background: activity.is_favorite ? '#FFFBEB' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transform: starPressed ? 'scale(1.4)' : 'scale(1)',
                transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease',
              }}
            >
              <Star
                size={15}
                strokeWidth={2}
                style={{
                  fill: activity.is_favorite ? '#F59E0B' : 'none',
                  color: activity.is_favorite ? '#F59E0B' : '#c7c7cc',
                  transition: 'fill 0.2s ease, color 0.2s ease',
                }}
              />
            </button>
          </div>

          {/* Place */}
          {activity.place && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: 5,
              }}
            >
              <MapPin size={11} strokeWidth={2.5} style={{ color: accent.dot, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#8e8e93', lineHeight: 1 }}>
                {activity.place}
              </span>
            </div>
          )}

          {/* Notes */}
          {activity.notes && (
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                marginTop: 6,
                background: 'rgba(0,0,0,0.025)',
                borderRadius: 8,
                padding: '6px 8px',
              }}
            >
              <FileText
                size={11}
                strokeWidth={2}
                style={{ color: '#c7c7cc', marginTop: 1, flexShrink: 0 }}
              />
              <p style={{ fontSize: 12, color: '#6c6c70', lineHeight: 1.5, margin: 0 }}>
                {activity.notes}
              </p>
            </div>
          )}

          {/* Bottom action row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 4,
              marginTop: 10,
            }}
          >
            <EditActivitySheet activity={activity} tripId={tripId} />

            <button
              onClick={() => setShowDelete(true)}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF1F0')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Trash2 size={14} strokeWidth={2} style={{ color: '#c7c7cc' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ── iOS Action Sheet — delete confirm ─────────────────────── */}
      {showDelete && (
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
          onClick={() => setShowDelete(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#F2F2F7',
              borderRadius: '20px 20px 0 0',
              padding: '8px 16px 32px',
              animation: 'sheetUp 0.32s cubic-bezier(0.34,1.2,0.64,1) both',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                background: 'rgba(60,60,67,0.3)',
                margin: '8px auto 18px',
              }}
            />
            <p style={{ fontSize: 13, color: '#8e8e93', textAlign: 'center', marginBottom: 4 }}>
              ¿Eliminar{' '}
              <strong style={{ color: '#0a0a0a', fontWeight: 600 }}>{activity.title}</strong>?
            </p>
            <p style={{ fontSize: 12, color: '#8e8e93', textAlign: 'center', marginBottom: 16 }}>
              Esta acción no se puede deshacer.
            </p>
            <button
              onClick={confirmDelete}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 14,
                border: 'none',
                background: 'white',
                fontSize: 17,
                fontWeight: 600,
                color: '#FF3B30',
                cursor: 'pointer',
                marginBottom: 8,
              }}
            >
              Eliminar actividad
            </button>
            <button
              onClick={() => setShowDelete(false)}
              style={{
                width: '100%',
                height: 52,
                borderRadius: 14,
                border: 'none',
                background: 'white',
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
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
