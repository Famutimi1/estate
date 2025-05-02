import { supabase } from '../supabase';
import { Database } from '../database.types';

export type Property = Database['public']['Tables']['properties']['Row'];

export async function getProperties(filters?: {
  propertyType?: string;
  propertyStatus?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: string;
}) {
  let query = supabase
    .from('properties')
    .select('*');

  // Apply filters if provided
  if (filters) {
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }
    
    if (filters.propertyStatus) {
      const status = filters.propertyStatus === 'for-sale' ? 'FOR SALE' : 'FOR RENT';
      query = query.eq('status', status);
    }
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    
    if (filters.location) {
      query = query.eq('location', filters.location);
    }
    
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    
    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }
    } else {
      // Default sorting by newest
      query = query.order('created_at', { ascending: false });
    }
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  
  return data || [];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching property:', error);
    return null;
  }
  
  return data;
}

export async function createProperty(property: Database['public']['Tables']['properties']['Insert']) {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select();
  
  if (error) {
    console.error('Error creating property:', error);
    return null;
  }
  
  return data[0];
}

export async function updateProperty(
  id: string,
  updates: Database['public']['Tables']['properties']['Update']
) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('Error updating property:', error);
    return null;
  }
  
  return data[0];
}

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting property:', error);
    return false;
  }
  
  return true;
}