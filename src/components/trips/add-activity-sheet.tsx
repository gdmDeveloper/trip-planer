'use client';

import { useRef, useState } from 'react';
import { Plus, MapPin, Clock, AlignLeft, X } from 'lucide-react';
import { createActivity } from '@/app/actions/activities';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface AddActivitySheetProps {
  dayId: string;
  tripId: string;
}

export function AddActivitySheet({ dayId, tripId }: AddActivitySheetProps) {
  const [open, setOpen] = useState(false);
  const [fabPressed, setFabPressed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await createActivity(formData);
    formRef.current?.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* ── iOS FAB ──────────────────────────────────────────── */}
        <button
          onMouseDown={() => setFabPressed(true)}
          onMouseUp={() => setFabPressed(false)}
          onMouseLeave={() => setFabPressed(false)}
          onTouchStart={() => setFabPressed(true)}
          onTouchEnd={() => setFabPressed(false)}
          style={{
            position: 'fixed',
            bottom: 32,
            right: 24,
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: '#007AFF',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 50,
            boxShadow: fabPressed
              ? '0 4px 12px rgba(0,122,255,0.3)'
              : '0 6px 24px rgba(0,122,255,0.45)',
            transform: fabPressed ? 'scale(0.91)' : 'scale(1)',
            transition: 'transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s ease',
          }}
        >
          <Plus
            size={26}
            strokeWidth={2.5}
            style={{
              color: 'white',
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="border-none p-0 focus:outline-none"
        style={{
          borderRadius: '20px 20px 0 0',
          background: '#F2F2F7',
          paddingBottom: 'env(safe-area-inset-bottom)',
          maxHeight: '92dvh',
          overflowY: 'auto',
        }}
      >
        {/* ── Handle + header ──────────────────────────────────── */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'rgba(242,242,247,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '0.5px solid rgba(0,0,0,0.08)',
            padding: '10px 16px 14px',
          }}
        >
          {/* Handle */}
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'rgba(60,60,67,0.3)',
              margin: '0 auto 14px',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <SheetTitle
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: '#0a0a0a',
                margin: 0,
                letterSpacing: '-0.2px',
              }}
            >
              Nueva actividad
            </SheetTitle>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: 'rgba(116,116,128,0.18)',
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
        </div>

        {/* ── Form ─────────────────────────────────────────────── */}
        <form ref={formRef} action={handleAction}>
          <input type="hidden" name="day_id" value={dayId} />
          <input type="hidden" name="trip_id" value={tripId} />

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Title field — most important, full width, larger */}
            <FormCard>
              <FieldLabel>¿Qué vas a hacer?</FieldLabel>
              <input
                id="act-title"
                name="title"
                placeholder="Ej: Snorkel en la cala"
                required
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0)')}
              />
            </FormCard>

            {/* Place */}
            <FormCard>
              <FieldLabel
                icon={<MapPin size={13} strokeWidth={2.5} style={{ color: '#007AFF' }} />}
              >
                Lugar
              </FieldLabel>
              <input
                id="act-place"
                name="place"
                placeholder="Playa del Carmen"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0)')}
              />
            </FormCard>

            {/* Time + (future: duration) side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <FormCard>
                <FieldLabel
                  icon={<Clock size={13} strokeWidth={2.5} style={{ color: '#007AFF' }} />}
                >
                  Hora
                </FieldLabel>
                <input
                  id="act-time"
                  name="time"
                  type="time"
                  style={{ ...inputStyle, colorScheme: 'light' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0)')}
                />
              </FormCard>
              {/* Placeholder for a future field */}
              <div />
            </div>

            {/* Notes */}
            <FormCard>
              <FieldLabel
                icon={<AlignLeft size={13} strokeWidth={2.5} style={{ color: '#007AFF' }} />}
              >
                Notas
              </FieldLabel>
              <textarea
                id="act-notes"
                name="notes"
                placeholder="No olvidar el protector solar..."
                rows={3}
                style={{
                  ...inputStyle,
                  height: 'auto',
                  resize: 'none',
                  lineHeight: 1.5,
                  paddingTop: 10,
                  paddingBottom: 10,
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0)')}
              />
            </FormCard>
          </div>

          {/* ── Submit button ───────────────────────────────────── */}
          <div
            style={{
              padding: '0 16px 24px',
              position: 'sticky',
              bottom: 0,
              background: 'linear-gradient(to top, #F2F2F7 80%, transparent)',
            }}
          >
            <button
              type="submit"
              style={{
                width: '100%',
                height: 54,
                borderRadius: 14,
                background: '#007AFF',
                border: 'none',
                color: 'white',
                fontSize: 17,
                fontWeight: 600,
                cursor: 'pointer',
                letterSpacing: '-0.2px',
                boxShadow: '0 4px 14px rgba(0,122,255,0.35)',
                transition: 'transform 0.15s ease, opacity 0.15s ease',
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.97)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Añadir al itinerario
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 14,
        padding: '12px 14px',
        border: '0.5px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        color: '#8e8e93',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 6,
      }}
    >
      {icon}
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 40,
  background: 'transparent',
  border: '1px solid rgba(0,0,0,0)',
  borderRadius: 8,
  fontSize: 16,
  color: '#0a0a0a',
  outline: 'none',
  padding: '0 4px',
  transition: 'border-color 0.2s ease',
  boxSizing: 'border-box',
};
