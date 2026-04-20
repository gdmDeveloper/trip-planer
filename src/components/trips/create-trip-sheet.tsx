'use client';

import { useRef, useState } from 'react';
import { Plus, Calendar, Map, AlignLeft } from 'lucide-react';
import { createTrip } from '@/app/actions/trips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export function CreateTripSheet() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await createTrip(formData);
    formRef.current?.reset();
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* Botón flotante idéntico al de actividades para coherencia visual */}
        <button className="fixed bottom-8 right-6 w-16 h-16 bg-linear-to-tr from-orange-500 to-rose-400 text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(249,115,22,0.4)] active:scale-90 transition-all z-50 group">
          <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-[2.5rem] border-none bg-orange-50/95 backdrop-blur-md pb-12 pt-6"
      >
        <div className="px-6 space-y-7">
          {/* Header con estilo logo */}
          <div className="flex flex-col items-center gap-4 relative">
            <div className="w-12 h-1.5 bg-orange-200 rounded-full" />

            <div className="flex w-full items-center justify-between">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-orange-950 flex items-center gap-2.5">
                  <Map className="text-orange-500" size={24} />
                  Nuevo Destino
                </SheetTitle>
              </SheetHeader>
            </div>
          </div>

          <form ref={formRef} action={handleAction} className="space-y-6">
            {/* Campo: Título del Viaje */}
            <div className="space-y-2.5">
              <Label htmlFor="title" className="text-orange-900 font-semibold text-base ml-1">
                ¿A dónde vamos?
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Verano en Mallorca 🏝️"
                required
                className="bg-white border-orange-100 focus:border-orange-300 focus:ring-orange-200 rounded-xl h-14 shadow-sm text-base px-5"
              />
            </div>

            {/* Campo: Descripción */}
            <div className="space-y-2.5">
              <Label
                htmlFor="description"
                className="text-orange-900 font-semibold text-base ml-1 flex items-center gap-2"
              >
                <AlignLeft className="text-orange-500" size={18} />
                Descripción
              </Label>
              <Input
                id="description"
                name="description"
                placeholder="Ruta por las mejores calas..."
                className="bg-white border-orange-100 focus:border-orange-300 rounded-xl h-14 shadow-sm text-base px-5"
              />
            </div>

            {/* Campos: Fechas */}
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2.5">
                <Label
                  htmlFor="start_date"
                  className="text-orange-900 font-semibold text-base ml-1 flex items-center gap-2"
                >
                  <Calendar size={18} className="text-orange-500" />
                  Ida
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  className="bg-white border-orange-100 focus:border-orange-300 rounded-xl h-14 shadow-sm text-base px-5 appearance-none"
                />
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor="end_date"
                  className="text-orange-900 font-semibold text-base ml-1 flex items-center gap-2"
                >
                  <Calendar size={18} className="text-orange-500" />
                  Vuelta
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  className="bg-white border-orange-100 focus:border-orange-300 rounded-xl h-14 shadow-sm text-base px-5"
                />
              </div>
            </div>

            {/* Botón de Acción */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-[0.98]"
              >
                Empezar a planear
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
