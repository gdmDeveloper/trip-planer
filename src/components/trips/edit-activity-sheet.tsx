'use client';

import { useState, useTransition } from 'react';
import { Pencil } from 'lucide-react';
import { updateActivity } from '@/app/actions/activities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Activity } from '@/types/database';

interface EditActivitySheetProps {
  activity: Activity;
  tripId: string;
}

export function EditActivitySheet({ activity, tripId }: EditActivitySheetProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(activity.title);
  const [place, setPlace] = useState(activity.place ?? '');
  const [time, setTime] = useState(activity.time?.slice(0, 5) ?? '');
  const [notes, setNotes] = useState(activity.notes ?? '');

  function handleSave() {
    startTransition(async () => {
      await updateActivity(activity.id, tripId, { title, place, time, notes });
      setOpen(false);
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-1.5 rounded-full hover:bg-slate-100 transition-colors">
          <Pencil size={15} className="text-slate-300" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-10">
        <SheetHeader className="mb-4">
          <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-left">Editar actividad</SheetTitle>
        </SheetHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Lugar</Label>
            <Input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Hora</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Notas</Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opcional"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={isPending || !title}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
