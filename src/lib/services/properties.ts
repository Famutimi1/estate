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
  page?: number;
  limit?: number;
}) {
  // Create base query
  let query = supabase
    .from('properties')
    .select('*');
  
  // Create a separate count query
  let countQuery = supabase
    .from('properties')
    .select('id', { count: 'exact', head: true });

  // Apply filters if provided
  if (filters) {
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
      countQuery = countQuery.eq('property_type', filters.propertyType);
    }
    
    if (filters.propertyStatus) {
      const status = filters.propertyStatus === 'for-sale' ? 'For Sale' : 'For Rent';
      query = query.eq('property_status', status);
      countQuery = countQuery.eq('property_status', status);
    }
    
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
      countQuery = countQuery.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
      countQuery = countQuery.lte('price', filters.maxPrice);
    }
    
    if (filters.location) {
      query = query.eq('location', filters.location);
      countQuery = countQuery.eq('location', filters.location);
    }
    
    if (filters.bedrooms) {
      query = query.gte('bedrooms', filters.bedrooms);
      countQuery = countQuery.gte('bedrooms', filters.bedrooms);
    }
    
    if (filters.bathrooms) {
      query = query.gte('bathrooms', filters.bathrooms);
      countQuery = countQuery.gte('bathrooms', filters.bathrooms);
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

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 100;
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);
  }

  // Execute both queries in parallel
  const [dataResult, countResult] = await Promise.all([
    query,
    countQuery
  ]);
  
  if (dataResult.error) {
    console.error('Error fetching properties:', dataResult.error);
    return { properties: [], total: 0 };
  }
  
  if (countResult.error) {
    console.error('Error counting properties:', countResult.error);
    return { properties: dataResult.data || [], total: 0 };
  }
  
  return { 
    properties: dataResult.data || [], 
    total: countResult.count || 0 
  };
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
  try {
    // Ensure required fields are present
    if (!property.title || !property.price || !property.property_status || 
        !property.status || !property.address || !property.description || 
        !property.property_type || !property.location || !property.image_url ||
        !property.city || !property.state || !property.zip_code) {
      console.error('Missing required property fields');
      return null;
    }

    // Ensure property status is correctly formatted
    if (property.property_status !== 'For Sale' && property.property_status !== 'For Rent') {
      property.property_status = property.property_status === 'for-sale' ? 'For Sale' : 'For Rent';
    }

    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select();
    
    if (error) {
      console.error('Error creating property:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('Exception in createProperty:', err);
    return null;
  }
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