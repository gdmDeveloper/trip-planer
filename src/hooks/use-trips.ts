'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import type { Trip } from '@/types/database'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTrips() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('trips')
        .select(`
          *,
          trip_members!inner(user_id)
        `)
        .order('created_at', { ascending: false })

      if (!error && data) setTrips(data)
      setLoading(false)
    }

    fetchTrips()
  }, [])

  return { trips, loading }
}