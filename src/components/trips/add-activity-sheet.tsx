'use client';

import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { createActivity } from '@/app/actions/activities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface AddActivitySheetProps {
  dayId: string;
  tripId: string;
}

export function AddActivitySheet({ dayId, tripId }: AddActivitySheetProps) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await createActivity(formData);
    formRef.current?.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-6 right-4 w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-50">
          <Plus size={26} />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-10">
        <SheetHeader className="mb-4">
          <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-left">Nueva actividad</SheetTitle>
        </SheetHeader>
        <form ref={formRef} action={handleAction} className="space-y-3">
          <input type="hidden" name="day_id" value={dayId} />
          <input type="hidden" name="trip_id" value={tripId} />
          <div className="space-y-1.5">
            <Label htmlFor="act-title">Nombre</Label>
            <Input id="act-title" name="title" placeholder="Senso-ji Temple" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="act-place">Lugar</Label>
            <Input id="act-place" name="place" placeholder="Asakusa, Tokio" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="act-time">Hora</Label>
              <Input id="act-time" name="time" type="time" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="act-notes">Notas</Label>
            <Input id="act-notes" name="notes" placeholder="Ir temprano para evitar colas..." />
          </div>
          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
            Añadir actividad
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
