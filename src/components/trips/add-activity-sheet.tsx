'use client';

import { useRef, useState } from 'react';
import { Plus, MapPin, Clock, AlignLeft, Sparkles, X } from 'lucide-react'; // Añadido X para el cierre
import { createActivity } from '@/app/actions/activities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

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
        {/* Botón flotante estilo veraniego con gradiente */}
        <button className="fixed bottom-8 right-6 w-16 h-16 bg-gradient-to-tr from-orange-500 to-rose-400 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(249,115,22,0.4)] active:scale-90 transition-all z-50 group">
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </SheetTrigger>

      {/* AJUSTE: He eliminado px-0 de SheetContent si lo tenías por defecto */}
      <SheetContent
        side="bottom"
        className="rounded-t-[2.5rem] border-none bg-orange-50/95 backdrop-blur-md pb-12 pt-6"
      >
        {/* AJUSTE: Contenedor principal con padding lateral (px-6) */}
        <div className="px-6 space-y-7">
          {/* Header con el "handle" y el título/cierre */}
          <div className="flex flex-col items-center gap-4 relative">
            <div className="w-12 h-1.5 bg-orange-200 rounded-full" />

            <div className="flex w-full items-center justify-between">
              <SheetTitle className="text-2xl font-bold text-orange-950 flex items-center gap-2.5">
                <Sparkles className="text-orange-500" size={24} />
                Nueva Actividad
              </SheetTitle>
            </div>
          </div>

          <form ref={formRef} action={handleAction} className="space-y-6">
            <input type="hidden" name="day_id" value={dayId} />
            <input type="hidden" name="trip_id" value={tripId} />

            {/* Campo: Nombre */}
            <div className="space-y-2.5">
              <Label htmlFor="act-title" className="text-orange-900 font-semibold text-base ml-1">
                ¿Qué vas a hacer?
              </Label>
              <Input
                id="act-title"
                name="title"
                placeholder="Ej: Snorkel en la cala"
                required
                className="bg-white border-orange-100 focus:border-orange-300 focus:ring-orange-200 rounded-xl h-14 shadow-sm text-base px-5"
              />
            </div>

            {/* Campo: Lugar */}
            <div className="space-y-2.5">
              <Label
                htmlFor="act-place"
                className="text-orange-900 font-semibold text-base ml-1 flex items-center gap-2"
              >
                <MapPin className="text-orange-500" size={18} />
                Lugar
              </Label>
              <Input
                id="act-place"
                name="place"
                placeholder="Playa del Carmen"
                className="bg-white border-orange-100 focus:border-orange-300 rounded-xl h-14 shadow-sm text-base px-5"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              {/* Campo: Hora */}
              <div className="space-y-2.5">
                <Label
                  htmlFor="act-time"
                  className="text-orange-900 font-semibold text-base ml-1 flex items-center gap-2"
                >
                  <Clock size={18} className="text-orange-500" />
                  Hora
                </Label>
                <div className="relative">
                  <Input
                    id="act-time"
                    name="time"
                    type="time"
                    className="bg-white border-orange-100 focus:border-orange-300 rounded-xl h-14 shadow-sm text-base px-5"
                  />
                </div>
              </div>
            </div>

            {/* Campo: Notas */}
            <div className="space-y-2.5">
              <Label
                htmlFor="act-notes"
                className="text-orange-900 font-semibold text-base ml-1 flex items-center gap-2"
              >
                <AlignLeft size={18} className="text-orange-500" />
                Notas mágicas
              </Label>
              <Input
                id="act-notes"
                name="notes"
                placeholder="No olvidar el protector solar..."
                className="bg-white border-orange-100 focus:border-orange-300 rounded-xl h-14 shadow-sm text-base px-5"
              />
            </div>

            {/* Botón de envío - Mejorado */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98] px-8"
              >
                Añadir al itinerario
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
