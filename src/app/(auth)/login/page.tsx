import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">🗾 Japan Trip Planner</h1>
          <p className="text-slate-500 text-sm">Inicia sesión para ver tus viajes</p>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-slate-900 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
        <p className="text-center text-sm text-slate-500">
          ¿Recibes un enlace de invitación?{' '}
          <Link href="/register" className="text-slate-900 font-medium hover:underline">
            Crea tu cuenta primero
          </Link>
        </p>
      </div>
    </div>
  );
}
