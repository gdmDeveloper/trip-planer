'use client'


export const useDaysLeft = (date: string | null) => {
  if (!date) return '';
  const target = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy ✈️';
  if (diffDays === 1) return 'Mañana';
  if (diffDays < 0) return 'Finalizado';
  return `Faltan ${diffDays} días`;
};