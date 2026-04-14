'use client';

import { useState, useTransition } from 'react';
import { Users, Link2, Mail, Trash2, Copy, Check } from 'lucide-react';
import { inviteByEmail, generateInviteLink, removeMember } from '@/app/actions/members';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

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
    if (!confirm('¿Eliminar a este miembro?')) return;
    startTransition(() => removeMember(tripId, userId));
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Users size={20} className="text-slate-600" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-10 max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-5">
          <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-left">Colaboradores</SheetTitle>
        </SheetHeader>

        {/* Miembros actuales */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">
            Miembros ({members.length})
          </p>
          <div className="space-y-2">
            {members.map((member) => (
              <div
                key={member.user_id}
                className="flex items-center justify-between py-2 border-b border-slate-100"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-medium text-violet-700">
                    {member.email?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div>
                    <p className="text-sm text-slate-700">
                      {member.email ?? member.user_id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-slate-400 capitalize">{member.role}</p>
                  </div>
                </div>
                {member.user_id !== currentUserId && member.role !== 'owner' && (
                  <button
                    onClick={() => handleRemove(member.user_id)}
                    className="p-1.5 rounded-full hover:bg-slate-100"
                  >
                    <Trash2 size={14} className="text-slate-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Invitar por email */}
        <div className="mb-5">
          <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">
            Invitar por email
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="amigo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleInviteByEmail}
              disabled={isPending || !email}
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              <Mail size={15} />
            </Button>
          </div>
          {emailError && <p className="text-xs text-red-500 mt-1.5">{emailError}</p>}
          {emailSuccess && <p className="text-xs text-teal-600 mt-1.5">Invitación enviada</p>}
        </div>

        {/* Link de invitación */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wide">
            Enlace de invitación
          </p>
          {!inviteLink ? (
            <Button
              onClick={handleGenerateLink}
              disabled={isPending}
              variant="outline"
              className="w-full"
            >
              <Link2 size={15} className="mr-2" />
              Generar enlace
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input value={inviteLink} readOnly className="flex-1 text-xs" />
              <Button onClick={handleCopy} size="sm" variant="outline">
                {copied ? <Check size={15} className="text-teal-600" /> : <Copy size={15} />}
              </Button>
            </div>
          )}
          <p className="text-xs text-slate-400 mt-1.5">El enlace expira en 7 días</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
