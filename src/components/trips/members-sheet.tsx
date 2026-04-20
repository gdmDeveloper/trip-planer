'use client';

import { useState, useTransition } from 'react';
import { Users, Link2, Mail, Trash2, Copy, Check, Sparkles, X } from 'lucide-react';
import { inviteByEmail, generateInviteLink, removeMember } from '@/app/actions/members';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

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

export function MembersSheet({ tripId, members, currentUserId }: MembersSheetProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
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
      const link = `${window.location.origin}/invite/${token}`;
      setInviteLink(link);
    });
  }

  function handleCopy() {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleRemove(userId: string) {
    if (!confirm('¿Quitar a este viajero del grupo? 🥥')) return;
    startTransition(() => removeMember(tripId, userId));
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center p-2.5 bg-white rounded-xl border border-orange-100 shadow-sm text-orange-600 active:scale-90 transition-all">
          <Users size={20} strokeWidth={2.5} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-[2.5rem] border-none bg-orange-50/98 backdrop-blur-xl pb-12 pt-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="px-6 space-y-8">
          {/* Header */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-1.5 bg-orange-200 rounded-full" />
            <div className="flex w-full items-center justify-between">
              <SheetTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="text-orange-500" size={24} />
                Compañeros
              </SheetTitle>
            </div>
          </div>

          {/* Lista de Miembros Estilo Card */}
          <div className="space-y-4">
            <p className="text-[11px] font-bold text-orange-900/40 uppercase tracking-[0.15em] ml-1">
              Viajando ahora ({members.length})
            </p>
            <div className="bg-white/60 rounded-[2rem] p-2 border border-orange-100/50 space-y-1">
              {members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center justify-between p-3 rounded-2xl transition-colors hover:bg-orange-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-rose-400 p-[2px] shadow-sm">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-orange-600">
                        {member.email?.[0]?.toUpperCase() ?? '?'}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate max-w-[140px]">
                        {member.email?.split('@')[0] ?? 'Invitado'}
                      </p>
                      <p className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                        {member.role === 'owner' ? '👑 Organizador' : 'Viajero'}
                      </p>
                    </div>
                  </div>

                  {member.user_id !== currentUserId && member.role !== 'owner' && (
                    <button
                      onClick={() => handleRemove(member.user_id)}
                      className="p-2.5 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sección Invitar */}
          <div className="space-y-6 pt-2">
            {/* Email */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-orange-900/40 uppercase tracking-[0.15em] ml-1">
                Añadir por Email
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="amigo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white border-orange-100 rounded-2xl focus:ring-orange-200 px-5 text-sm font-medium"
                />
                <Button
                  onClick={handleInviteByEmail}
                  disabled={isPending || !email}
                  className="h-14 w-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex-shrink-0"
                >
                  {emailSuccess ? <Check size={20} /> : <Mail size={20} />}
                </Button>
              </div>
              {emailError && (
                <p className="text-[11px] font-bold text-rose-500 ml-1">{emailError}</p>
              )}
            </div>

            {/* Link Mágico */}
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-orange-900/40 uppercase tracking-[0.15em] ml-1">
                Enlace Mágico
              </p>
              {!inviteLink ? (
                <Button
                  onClick={handleGenerateLink}
                  disabled={isPending}
                  variant="outline"
                  className="w-full h-14 rounded-2xl border-2 border-dashed border-orange-200 text-orange-700 font-bold hover:bg-orange-50 hover:border-orange-300 transition-all"
                >
                  <Link2 size={18} className="mr-2" />
                  Generar enlace de invitación
                </Button>
              ) : (
                <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex-1 h-14 bg-orange-100/50 border border-orange-200 rounded-2xl flex items-center px-4 overflow-hidden">
                    <code className="text-[10px] font-bold text-orange-800 truncate uppercase tracking-tight">
                      {inviteLink}
                    </code>
                  </div>
                  <Button
                    onClick={handleCopy}
                    className={`h-14 w-14 rounded-2xl transition-all ${copied ? 'bg-teal-500 text-white' : 'bg-orange-500 text-white'}`}
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </Button>
                </div>
              )}
              <p className="text-[10px] font-medium text-slate-400 text-center italic">
                Cualquiera con este enlace podrá unirse al viaje. Expira en 7 días.
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
