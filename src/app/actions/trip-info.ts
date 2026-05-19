'use server';

import { createAdminClient } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';

interface TripInfoPayload {
  hotels: object[];
  notes: string;
}

export async function saveTripInfo(tripId: string, payload: TripInfoPayload) {
  const admin = createAdminClient();

  const { error } = await admin
    .from('trip_info')           // crea esta tabla: id, trip_id, jsonb, hotels jsonb, notes text
    .upsert(
      { trip_id: tripId, ...payload, updated_at: new Date().toISOString() },
      { onConflict: 'trip_id' }
    );

  if (error) {
    console.error('saveTripInfo error:', error);
    return { error: error.message };
  }

  revalidatePath(`/dashboard/trips/${tripId}`);
  return { success: true };
}

export async function getTripInfo(tripId: string) {
  const admin = createAdminClient();

  const { data } = await admin
    .from('trip_info')
    .select('hotels, notes')
    .eq('trip_id', tripId)
    .single();

  return {
    hotels:  data?.hotels  ?? [],
    notes:   data?.notes   ?? '',
  };
}