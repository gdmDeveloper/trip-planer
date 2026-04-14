import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">🗾 Your Trip Planner</h1>
          <p className="text-slate-500 text-sm">Crea tu cuenta para empezar</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-slate-900 font-medium hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
