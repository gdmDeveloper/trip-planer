export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Trip {
  id: string
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  cover_image: string | null
  created_at: string
}

export interface TripMember {
  id: string
  trip_id: string
  user_id: string
  role: 'owner' | 'editor'
  joined_at: string
}

export interface TripDay {
  id: string
  trip_id: string
  day_number: number
  date: string | null
  title: string | null
  created_at: string
}

export interface Activity {
  id: string
  day_id: string
  title: string
  place: string | null
  time: string | null
  notes: string | null
  is_favorite: boolean
  order_index: number
  created_at: string
}

export interface TripWithMembers extends Trip {
  trip_members: TripMember[]
}

export interface TripDayWithActivities extends TripDay {
  activities: Activity[]
}