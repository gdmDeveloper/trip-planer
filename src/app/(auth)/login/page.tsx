import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] px-6 font-sans antialiased text-black">
      <div className="w-full max-w-sm">
        {/* Logo y Bienvenida con Animación de entrada */}
        <div
          className="text-center space-y-6 mb-10 animate-slide-up"
          style={{ animationDelay: '0ms' }}
        >
          <div className="flex justify-center">
            <div
              className="p-3 rounded-[22px] shadow-xl shadow-blue-500/20 animate-scale-in"
              style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #6366F1 100%)' }}
            >
              <Sparkles className="text-white" size={32} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-[28px] font-extrabold tracking-tight text-black italic">
              Trip Planner
            </h1>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.15em]">
              Tu próxima aventura espera
            </p>
          </div>
        </div>

        {/* Contenedor del Formulario - Estilo Card iOS */}
        <div
          className="bg-white rounded-[32px] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="bg-[#F9F9F9]/50 backdrop-blur-md rounded-[26px] p-6 border border-white/60">
            <Suspense
              fallback={
                <div className="h-64 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-widest">
                    Cargando
                  </span>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>

        {/* Footer Links - Estilo Minimalista Apple */}
        <div className="mt-10 space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <p className="text-center text-[14px] font-medium text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link
              href="/register"
              className="text-blue-500 font-bold hover:text-blue-600 transition-colors ml-1"
            >
              Crea una ahora
            </Link>
          </p>

          <div className="h-[0.5px] w-12 bg-gray-300 mx-auto" />

          <p className="text-center text-[12px] font-medium text-gray-400 leading-relaxed px-4">
            ¿Tienes un enlace de invitación?{' '}
            <Link href="/register" className="text-gray-600 hover:underline block mt-1">
              Únete a tu grupo de viaje
            </Link>
          </p>
        </div>
      </div>

      {/* Reutilizamos los mismos keyframes del dashboard para consistencia */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up  { animation: slideUp 0.52s cubic-bezier(0.34,1.4,0.64,1) both; }
        .animate-fade-in   { animation: fadeIn 0.4s ease both; }
        .animate-scale-in  { animation: scaleIn 0.48s cubic-bezier(0.34,1.4,0.64,1) both; }
      `}</style>
    </div>
  );
}
