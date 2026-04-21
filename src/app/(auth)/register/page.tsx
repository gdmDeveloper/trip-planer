import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-6">
      <div className="w-full max-w-sm space-y-10">
        {/* Cabecera Minimalista */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-linear-to-br from-orange-500 to-rose-500 p-2.5 rounded-2xl shadow-lg shadow-orange-100">
              <Sparkles className="text-white" size={24} />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Crea tu cuenta</h1>
            <p className="text-[13px] font-medium text-slate-400 uppercase tracking-widest">
              Empieza a planear tu ruta
            </p>
          </div>
        </div>

        {/* Contenedor del Formulario con efecto Glass */}
        <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-2 border border-orange-100/50">
          <RegisterForm />
        </div>

        {/* Footer Link */}
        <div className="space-y-6 pt-2">
          <div className="h-[1px] w-8 bg-orange-100 mx-auto" />

          <p className="text-center text-[12px] font-bold text-slate-400 uppercase tracking-tight">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-orange-500 hover:text-orange-600 transition-colors ml-1"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
