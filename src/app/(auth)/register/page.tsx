import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7] px-6 font-sans antialiased text-black">
      <div className="w-full max-w-sm">
        {/* Cabecera con Animación de entrada */}
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
              Únete a la aventura
            </h1>
            <p className="text-[13px] font-bold text-gray-400 uppercase tracking-[0.15em]">
              Empieza a planear tu ruta
            </p>
          </div>
        </div>

        {/* Contenedor del Formulario - Estilo iOS Glass Card */}
        <div
          className="bg-white rounded-[32px] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-gray-100 animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="bg-[#F9F9F9]/50 backdrop-blur-md rounded-[26px] p-6 border border-white/60">
            <RegisterForm />
          </div>
        </div>

        {/* Footer Link - Consistente con el Login */}
        <div className="mt-10 space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="h-[0.5px] w-12 bg-gray-300 mx-auto" />

          <p className="text-center text-[14px] font-medium text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-blue-500 font-bold hover:text-blue-600 transition-colors ml-1"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Keyframes de animación inyectados */}
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
