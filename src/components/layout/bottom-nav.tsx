'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Star, User } from 'lucide-react';

const items = [
  { href: '/dashboard', icon: Home, label: 'Viajes' },
  { href: '/favorites', icon: Star, label: 'Favoritos' },
  { href: '/profile', icon: User, label: 'Perfil' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50">
      <div className="flex">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
            >
              <Icon
                size={22}
                className={active ? 'text-violet-600' : 'text-slate-400'}
                strokeWidth={active ? 2 : 1.5}
              />
              <span
                className={`text-xs ${active ? 'text-violet-600 font-medium' : 'text-slate-400'}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
