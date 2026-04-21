import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-6">
      <div className="w-full max-w-sm space-y-10">
        {/* Logo y Bienvenida Minimalista */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-linear-to-br from-orange-500 to-rose-500 p-2.5 rounded-2xl shadow-lg shadow-orange-100">
              <Sparkles className="text-white" size={24} />
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Bienvenido de nuevo
            </h1>
            <p className="text-[13px] font-medium text-slate-400 uppercase tracking-widest">
              Tu próxima aventura espera
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] p-2 border border-orange-100/50">
          <Suspense
            fallback={
              <div className="h-64 flex items-center justify-center text-slate-300 font-medium">
                Cargando...
              </div>
            }
          >
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer Links con Estilo Minimal */}
        <div className="space-y-4 pt-4">
          <p className="text-center text-[12px] font-bold text-slate-400 uppercase tracking-tight">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-orange-500 hover:text-orange-600 transition-colors ml-1"
            >
              Regístrate gratis
            </Link>
          </p>

          <div className="h-[1px] w-8 bg-orange-100 mx-auto" />

          <p className="text-center text-[11px] font-medium text-slate-300 leading-relaxed px-8">
            ¿Tienes un enlace de invitación?
            <Link href="/register" className="block text-slate-400 hover:text-slate-600 mt-1">
              Crea tu cuenta para unirte al grupo
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
