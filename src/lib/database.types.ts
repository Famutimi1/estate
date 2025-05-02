export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PropertyType = 'house' | 'apartment' | 'villa' | 'commercial' | 'land'
export type PropertyStatus = 'For Sale' | 'For Rent' 
export type Status = 'draft' | 'publish'

export interface Amenities {
  pool: boolean
  garden: boolean
  airConditioning: boolean
  heating: boolean
  internet: boolean
  parking: boolean
  securitySystem: boolean
  laundry: boolean
  petsAllowed: boolean
  furnished: boolean
}

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          title: string
          price: number
          status: Status
          property_status: PropertyStatus
          address: string
          description: string
          bedrooms: number
          bathrooms: number
          area: number
          area_unit: string
          property_type: PropertyType
          location: string
          image_url: string
          images: string[] | null
          featured_image_index: number | null
          city: string
          state: string
          zip_code: string
          garage_spaces: number | null
          amenities: Amenities | null
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          price: number
          status: Status
          property_status: PropertyStatus
          address: string
          description: string
          bedrooms: number
          bathrooms: number
          area: number
          area_unit: string
          property_type: PropertyType
          location: string
          image_url: string
          images?: string[] | null
          featured_image_index?: number | null
          city: string
          state: string
          zip_code: string
          garage_spaces?: number | null
          amenities?: Amenities | null
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          price?: number
          status: Status
          property_status: PropertyStatus
          address?: string
          description?: string
          bedrooms?: number
          bathrooms?: number
          area?: number
          area_unit?: string
          property_type?: PropertyType
          location?: string
          image_url?: string
          images?: string[] | null
          featured_image_index?: number | null
          city?: string
          state?: string
          zip_code?: string
          garage_spaces?: number | null
          amenities?: Amenities | null
          user_id?: string | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          avatar_url: string | null
          role: 'user' | 'admin' | 'agent'
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'agent'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'admin' | 'agent'
        }
      }
      favorites: {
        Row: {
          id: string
          created_at: string
          user_id: string
          property_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          property_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          property_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}