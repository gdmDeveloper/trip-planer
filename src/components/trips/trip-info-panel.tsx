'use client';

import { useState, useTransition } from 'react';
import {
  PlaneTakeoff,
  PlaneLanding,
  Hotel,
  StickyNote,
  X,
  Plus,
  Trash2,
  ChevronRight,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { saveTripInfo } from '@/app/actions/trip-info';
('@/app/actions/trip-info'); // crearás esta action

// ─── Types ────────────────────────────────────────────────────────────────────

interface Hotel {
  id: string;
  name: string;
  address?: string;
  checkIn: string;
  checkOut: string;
  confirmationCode?: string;
}

interface TripInfoPanelProps {
  tripId: string;
  initialHotels?: Hotel[];
  initialNotes?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function isValidUrl(str: string) {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function getMapsQueryText(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    const queryParam = url.searchParams.get('query');

    if (queryParam) {
      // decodeURIComponent limpia los caracteres especiales y replace cambia los "+" por espacios
      return decodeURIComponent(queryParam).replace(/\+/g, ' ');
    }

    // Si es una URL válida pero no tiene parámetro ?query= (ej: un enlace plano), mostramos el dominio
    return url.hostname + url.pathname;
  } catch (_) {
    return urlStr;
  }
}

const SECTION_COLORS = {
  hotels: { dot: '#34C759', bg: '#F0FDF4', icon: '#34C759' },
  notes: { dot: '#FF9500', bg: '#FFF7ED', icon: '#FF9500' },
};

// ─── Main component ───────────────────────────────────────────────────────────
export function TripInfoPanel({
  tripId,
  initialHotels = [],
  initialNotes = '',
}: TripInfoPanelProps) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'hotels' | 'notes'>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [notes, setNotes] = useState(initialNotes);
  const [btnPressed, setBtnPressed] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);

  // ── Persist helpers ────────────────────────────────────────────────────────
  function persist(patch: Partial<{ hotels: Hotel[]; notes: string }>) {
    // startTransition ahora envuelve una función de tipo () => void
    startTransition(() => {
      // Creamos una IIFE (función autoejecutable) asíncrona dentro para no retornar la promesa a React
      (async () => {
        const payload = {
          hotels: patch.hotels ?? hotels,
          notes: patch.notes ?? notes,
        };

        const res = await saveTripInfo(tripId, payload);

        if (res?.error) {
          // Aquí puedes manejar el error de Supabase en el estado si quieres
          console.error('Error en el servidor:', res.error);
        }
      })();
    });
  }

  // ── Hotel CRUD ────────────────────────────────────────────────────────────
  function addHotel() {
    const h: Hotel = { id: uid(), name: '', checkIn: '', checkOut: '' };
    const next = [...hotels, h];
    setHotels(next);
    persist({ hotels: next });
  }

  function updateHotel(id: string, patch: Partial<Hotel>) {
    const next = hotels.map((h) => (h.id === id ? { ...h, ...patch } : h));
    setHotels(next);
    persist({ hotels: next });
  }

  function removeHotel(id: string) {
    const next = hotels.filter((h) => h.id !== id);
    setHotels(next);
    persist({ hotels: next });
  }

  // ── Notes ─────────────────────────────────────────────────────────────────
  function handleNotes(val: string) {
    setNotes(val);
    persist({ notes: val });
  }

  // ── Badge counts ──────────────────────────────────────────────────────────
  const counts = {
    hotels: hotels.length,
    notes: notes.trim().length > 0 ? 1 : 0,
  };

  return (
    <>
      {/* ── Trigger FAB ──────────────────────────────────────────────────── */}
      <button
        onMouseDown={() => setBtnPressed(true)}
        onMouseUp={() => setBtnPressed(false)}
        onMouseLeave={() => setBtnPressed(false)}
        onTouchStart={() => setBtnPressed(true)}
        onTouchEnd={() => setBtnPressed(false)}
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 104, // just above the AddActivity FAB
          right: 24,
          width: 46,
          height: 46,
          borderRadius: 14,
          backgroundColor: 'white',
          border: '0.5px solid rgba(0,0,0,0.10)',
          boxShadow: btnPressed ? '0 2px 8px rgba(0,0,0,0.10)' : '0 4px 16px rgba(0,0,0,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transform: btnPressed ? 'scale(0.91)' : 'scale(1)',
          transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
          zIndex: 48,
        }}
      >
        <StickyNote size={20} strokeWidth={2} style={{ color: '#FF9500' }} />

        {/* Badge — total items */}
        {counts.hotels + counts.notes > 0 && (
          <div
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              backgroundColor: '#007AFF',
              border: '2px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 700,
              color: 'white',
              padding: '0 3px',
            }}
          >
            {counts.hotels + counts.notes}
          </div>
        )}
      </button>

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            backgroundColor: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            animation: 'fadeIn 0.2s ease both',
          }}
        />
      )}

      {/* ── Side panel ───────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(88vw, 380px)',
          zIndex: 50,
          backgroundColor: '#F2F2F7',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '56px 16px 0',
            backgroundColor: 'rgba(242,242,247,0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '0.5px solid rgba(0,0,0,0.08)',
            position: 'sticky',
            top: 0,
            zIndex: 5,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#0a0a0a',
                margin: 0,
                letterSpacing: '-0.3px',
              }}
            >
              Info del viaje
            </h2>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                backgroundColor: 'rgba(116,116,128,0.18)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={15} strokeWidth={2.5} style={{ color: '#3c3c43' }} />
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 6, paddingBottom: 12 }}>
            {(
              [
                { key: 'hotels', label: 'Alojamiento', emoji: '🏨' },
                { key: 'notes', label: 'Notas', emoji: '📝' },
              ] as const
            ).map(({ key, label, emoji }) => {
              const active = tab === key;
              const c = SECTION_COLORS[key];
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    flex: 1,
                    height: 36,
                    borderRadius: 10,
                    border: 'none',
                    backgroundColor: active ? c.bg : 'transparent',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    color: active ? c.dot : '#8e8e93',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 4,
                    position: 'relative',
                  }}
                >
                  <span>{emoji}</span>
                  <span>{label}</span>
                  {counts[key] > 0 && (
                    <span
                      style={{
                        minWidth: 14,
                        height: 14,
                        borderRadius: 7,
                        backgroundColor: active ? c.dot : '#c7c7cc',
                        color: 'white',
                        fontSize: 9,
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 3px',
                      }}
                    >
                      {counts[key]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, padding: '16px 16px 40px', overflowY: 'auto' }}>
          {/* HOTELS */}
          {tab === 'hotels' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {hotels.length === 0 && <EmptyState emoji="🏨" text="Sin alojamiento añadido aún" />}
              {hotels.map((h, i) => (
                <div
                  key={h.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    border: '0.5px solid rgba(0,0,0,0.07)',
                    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    animation: 'slideUp 0.3s cubic-bezier(0.34,1.4,0.64,1) both',
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <div style={{ height: 3, backgroundColor: '#34C759' }} />
                  <div
                    style={{
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <input
                        value={h.name}
                        onChange={(e) => updateHotel(h.id, { name: e.target.value })}
                        placeholder="Nombre del hotel"
                        style={{
                          ...inlineInput,
                          fontSize: 15,
                          fontWeight: 700,
                          color: '#0a0a0a',
                          flex: 1,
                        }}
                      />
                      <button onClick={() => removeHotel(h.id)} style={deleteBtn}>
                        <Trash2 size={13} strokeWidth={2} style={{ color: '#FF3B30' }} />
                      </button>
                    </div>
                    <FieldBox label="Dirección">
                      {h.address && isValidUrl(h.address) && activeFieldId !== `${h.id}-address` ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 6,
                          }}
                        >
                          <a
                            href={h.address}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              fontSize: 13,
                              color: '#007AFF', // Azul iOS
                              textDecoration: 'underline',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              flex: 1,
                              fontFamily: 'inherit',
                              fontWeight: 500,
                            }}
                          >
                            {/* ✨ AQUÍ EL CAMBIO: Extrae y limpia el texto del parámetro query */}
                            📍 {getMapsQueryText(h.address)}
                          </a>
                          <button
                            onClick={() => setActiveFieldId(`${h.id}-address`)} // Te permite volver a ver/editar la URL completa
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: 2,
                              display: 'flex',
                              alignItems: 'center',
                              color: '#007AFF',
                            }}
                          >
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      ) : (
                        <input
                          value={h.address ?? ''}
                          onChange={(e) => updateHotel(h.id, { address: e.target.value })}
                          onFocus={() => setActiveFieldId(`${h.id}-address`)}
                          onBlur={() => setActiveFieldId(null)}
                          placeholder="Calle, ciudad o enlace de Maps"
                          style={{ ...inlineInput, fontSize: 13 }}
                        />
                      )}
                    </FieldBox>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <FieldBox label="Check-in">
                        <input
                          type="date"
                          value={h.checkIn}
                          onChange={(e) => updateHotel(h.id, { checkIn: e.target.value })}
                          style={{ ...inlineInput, fontSize: 12, colorScheme: 'light' }}
                        />
                      </FieldBox>
                      <FieldBox label="Check-out">
                        <input
                          type="date"
                          value={h.checkOut}
                          onChange={(e) => updateHotel(h.id, { checkOut: e.target.value })}
                          style={{ ...inlineInput, fontSize: 12, colorScheme: 'light' }}
                        />
                      </FieldBox>
                    </div>

                    <FieldBox label="Código de reserva">
                      <input
                        value={h.confirmationCode ?? ''}
                        onChange={(e) => updateHotel(h.id, { confirmationCode: e.target.value })}
                        placeholder="ABC-123456"
                        style={{
                          ...inlineInput,
                          fontSize: 14,
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}
                      />
                    </FieldBox>
                  </div>
                </div>
              ))}

              <AddButton onClick={addHotel} label="Añadir alojamiento" />
            </div>
          )}

          {/* NOTES */}
          {tab === 'notes' && (
            <div>
              <textarea
                value={notes}
                onChange={(e) => handleNotes(e.target.value)}
                placeholder={
                  'Anota aquí lo que no quieres olvidar...\n\n• Número de emergencias\n• Seguro de viaje\n• Restricciones de equipaje'
                }
                style={{
                  width: '100%',
                  minHeight: 280,
                  backgroundColor: 'white',
                  border: '0.5px solid rgba(0,0,0,0.07)',
                  borderRadius: 16,
                  padding: '14px 16px',
                  fontSize: 15,
                  color: '#0a0a0a',
                  lineHeight: 1.6,
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255,149,0,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.07)')}
              />
              <p style={{ fontSize: 12, color: '#c7c7cc', textAlign: 'right', marginTop: 6 }}>
                {notes.length > 0 ? `${notes.length} caracteres` : 'Se guarda automáticamente'}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder, textarea::placeholder { color: #c7c7cc; }
      `}</style>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FieldBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        padding: '6px 10px',
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: '#8e8e93',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: '0 0 3px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

function EmptyState({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        border: '0.5px dashed rgba(0,0,0,0.12)',
      }}
    >
      <span style={{ fontSize: 32, marginBottom: 10 }}>{emoji}</span>
      <p style={{ fontSize: 14, color: '#8e8e93', margin: 0 }}>{text}</p>
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        height: 46,
        borderRadius: 14,
        border: '1.5px dashed rgba(0,122,255,0.3)',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 500,
        color: '#007AFF',
        transition: 'background-color 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,122,255,0.05)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
    >
      <Plus size={16} strokeWidth={2.5} />
      {label}
    </button>
  );
}

// ─── Shared styles ─────────────────────────────────────────────────────────────

const inlineInput: React.CSSProperties = {
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontSize: 14,
  color: '#0a0a0a',
  width: '100%',
  fontFamily: 'inherit',
  padding: 0,
};

const deleteBtn: React.CSSProperties = {
  width: 26,
  height: 26,
  borderRadius: 8,
  backgroundColor: '#FFF1F0',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
};
