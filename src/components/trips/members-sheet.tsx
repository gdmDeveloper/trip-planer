'use client';

import { useState, useTransition } from 'react';
import { Users, Link2, Mail, Trash2, Copy, Check, X, Crown } from 'lucide-react';
import { inviteByEmail, generateInviteLink, removeMember } from '@/app/actions/members';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface Member {
  user_id: string;
  role: string;
  email?: string;
}

interface MembersSheetProps {
  tripId: string;
  members: Member[];
  currentUserId: string;
}

// Consistent avatar color per member
const AVATAR_COLORS = [
  { bg: '#EFF6FF', text: '#1D4ED8' },
  { bg: '#F0FDF4', text: '#15803D' },
  { bg: '#FFF7ED', text: '#C2410C' },
  { bg: '#FDF4FF', text: '#9333EA' },
  { bg: '#FFF1F2', text: '#BE123C' },
];

export function MembersSheet({ tripId, members, currentUserId }: MembersSheetProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleInviteByEmail() {
    if (!email) return;
    setEmailError(null);
    setEmailSuccess(false);
    startTransition(async () => {
      const result = await inviteByEmail(tripId, email);
      if (result.error) {
        setEmailError(result.error);
      } else {
        setEmailSuccess(true);
        setEmail('');
        setTimeout(() => setEmailSuccess(false), 3000);
      }
    });
  }

  function handleGenerateLink() {
    startTransition(async () => {
      const { token } = await generateInviteLink(tripId);
      setInviteLink(`${window.location.origin}/invite/${token}`);
    });
  }

  function handleCopy() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRemove(userId: string) {
    setShowDeleteId(null);
    startTransition(() => removeMember(tripId, userId));
  }

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* Trigger: stacked avatars */}
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'white',
              borderRadius: 20,
              border: '0.5px solid rgba(0,0,0,0.08)',
              padding: '5px 10px 5px 6px',
              gap: 6,
              cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              transition: 'transform 0.15s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Stacked mini-avatars (max 3) */}
            <div style={{ display: 'flex', marginRight: 2 }}>
              {members.slice(0, 3).map((m, i) => {
                const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <div
                    key={m.user_id}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: c.bg,
                      border: '1.5px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      color: c.text,
                      marginLeft: i > 0 ? -8 : 0,
                      zIndex: 3 - i,
                      position: 'relative',
                    }}
                  >
                    {(m.email?.[0] ?? '?').toUpperCase()}
                  </div>
                );
              })}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#007AFF' }}>
              {members.length}
            </span>
          </button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          className="border-none p-0 focus:outline-none"
          style={{
            borderRadius: '20px 20px 0 0',
            background: '#F2F2F7',
            maxHeight: '90dvh',
            overflowY: 'auto',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* ── Sticky header ──────────────────────────────────── */}
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
                Compañeros de viaje
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

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* ── Members list ───────────────────────────────────── */}
            <section>
              <SectionLabel>
                {members.length} {members.length === 1 ? 'viajero' : 'viajeros'}
              </SectionLabel>
              <div
                style={{
                  background: 'white',
                  borderRadius: 16,
                  border: '0.5px solid rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
              >
                {members.map((member, i) => {
                  const c = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  const name = member.email?.split('@')[0] ?? 'Invitado';
                  const isOwner = member.role === 'owner';
                  const isMe = member.user_id === currentUserId;
                  const canRemove = !isMe && !isOwner;

                  return (
                    <div
                      key={member.user_id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 14px',
                        borderBottom:
                          i < members.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none',
                      }}
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: c.bg,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 15,
                          fontWeight: 700,
                          color: c.text,
                        }}
                      >
                        {(member.email?.[0] ?? '?').toUpperCase()}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 15,
                            fontWeight: 600,
                            color: '#0a0a0a',
                            margin: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {name}
                          {isMe && (
                            <span
                              style={{
                                fontSize: 12,
                                color: '#8e8e93',
                                fontWeight: 400,
                                marginLeft: 6,
                              }}
                            >
                              tú
                            </span>
                          )}
                        </p>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}
                        >
                          {isOwner && (
                            <Crown size={10} strokeWidth={2.5} style={{ color: '#F59E0B' }} />
                          )}
                          <span
                            style={{
                              fontSize: 12,
                              color: isOwner ? '#F59E0B' : '#8e8e93',
                              fontWeight: isOwner ? 600 : 400,
                            }}
                          >
                            {isOwner ? 'Organizador' : 'Viajero'}
                          </span>
                        </div>
                      </div>

                      {/* Remove */}
                      {canRemove && (
                        <button
                          onClick={() => setShowDeleteId(member.user_id)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 8,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#FFF1F0')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <Trash2 size={15} strokeWidth={2} style={{ color: '#c7c7cc' }} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* ── Invite by email ────────────────────────────────── */}
            <section>
              <SectionLabel>Añadir por email</SectionLabel>
              <div
                style={{
                  background: 'white',
                  borderRadius: 16,
                  border: '0.5px solid rgba(0,0,0,0.06)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="email"
                    placeholder="amigo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInviteByEmail()}
                    style={{
                      flex: 1,
                      height: 40,
                      background: '#F2F2F7',
                      border: '1px solid transparent',
                      borderRadius: 10,
                      fontSize: 15,
                      color: '#0a0a0a',
                      padding: '0 12px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(0,122,255,0.4)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'transparent')}
                  />
                  <button
                    onClick={handleInviteByEmail}
                    disabled={isPending || !email}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      border: 'none',
                      flexShrink: 0,
                      background: emailSuccess ? '#34C759' : '#007AFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: !email ? 0.4 : 1,
                      transition: 'background 0.25s ease, opacity 0.2s ease',
                    }}
                  >
                    {emailSuccess ? (
                      <Check size={18} strokeWidth={2.5} style={{ color: 'white' }} />
                    ) : (
                      <Mail size={18} strokeWidth={2} style={{ color: 'white' }} />
                    )}
                  </button>
                </div>
                {emailError && (
                  <p style={{ fontSize: 12, color: '#FF3B30', marginTop: 8, marginLeft: 2 }}>
                    {emailError}
                  </p>
                )}
              </div>
            </section>

            {/* ── Invite link ────────────────────────────────────── */}
            <section style={{ paddingBottom: 8 }}>
              <SectionLabel>Enlace de invitación</SectionLabel>
              {!inviteLink ? (
                <button
                  onClick={handleGenerateLink}
                  disabled={isPending}
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 14,
                    background: 'white',
                    border: '1.5px dashed rgba(0,122,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    fontSize: 15,
                    fontWeight: 500,
                    color: '#007AFF',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#EFF6FF')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
                >
                  <Link2 size={17} strokeWidth={2} />
                  Generar enlace
                </button>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    animation: 'fadeIn 0.3s ease both',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 46,
                      background: 'white',
                      borderRadius: 12,
                      border: '0.5px solid rgba(0,0,0,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 12px',
                      overflow: 'hidden',
                    }}
                  >
                    <code
                      style={{
                        fontSize: 11,
                        color: '#8e8e93',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {inviteLink}
                    </code>
                  </div>
                  <button
                    onClick={handleCopy}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 12,
                      border: 'none',
                      flexShrink: 0,
                      background: copied ? '#34C759' : '#007AFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'background 0.25s ease',
                    }}
                  >
                    {copied ? (
                      <Check size={18} strokeWidth={2.5} style={{ color: 'white' }} />
                    ) : (
                      <Copy size={16} strokeWidth={2} style={{ color: 'white' }} />
                    )}
                  </button>
                </div>
              )}
              <p style={{ fontSize: 12, color: '#c7c7cc', textAlign: 'center', marginTop: 8 }}>
                Expira en 7 días · Solo para uso personal
              </p>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      {/* ── Remove member action sheet ──────────────────────────── */}
      {showDeleteId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease both',
          }}
          onClick={() => setShowDeleteId(null)}
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
            <p style={{ fontSize: 13, color: '#8e8e93', textAlign: 'center', marginBottom: 16 }}>
              ¿Quitar a este viajero del grupo?
            </p>
            <button
              onClick={() => handleRemove(showDeleteId)}
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
              Quitar del viaje
            </button>
            <button
              onClick={() => setShowDeleteId(null)}
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
        @keyframes sheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
      `}</style>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: '#8e8e93',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: 8,
        paddingLeft: 4,
      }}
    >
      {children}
    </p>
  );
}
