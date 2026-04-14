'use client';

import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { createTrip } from '@/app/actions/trips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function CreateTripSheet() {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="fixed bottom-24 right-4 w-14 h-14 bg-violet-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-50">
          <Plus size={26} />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl pb-8">
        <SheetHeader className="mb-4">
          <div className="w-9 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
          <SheetTitle className="text-left">Nuevo viaje</SheetTitle>
        </SheetHeader>
        <form ref={formRef} action={createTrip} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Nombre del viaje</Label>
            <Input id="title" name="title" placeholder="Tokio y Kioto" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Descripción</Label>
            <Input id="description" name="description" placeholder="Opcional" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="start_date">Inicio</Label>
              <Input id="start_date" name="start_date" type="date" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="end_date">Fin</Label>
              <Input id="end_date" name="end_date" type="date" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
            Crear viaje
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
