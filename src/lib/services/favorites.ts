import { supabase } from '../supabase';
import { Database } from '../database.types';

export type Favorite = Database['public']['Tables']['favorites']['Row'];

// Get all favorites for a user
export async function getUserFavorites(userId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        properties(*)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return { success: true, favorites: data };
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return { success: false, error };
  }
}

// Add a property to favorites
export async function addToFavorites(userId: string, propertyId: string) {
  try {
    // Check if already favorited
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();
    
    if (existing) {
      return { success: true, message: 'Property already in favorites' };
    }
    
    // Add to favorites
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        property_id: propertyId
      })
      .select();
    
    if (error) throw error;
    
    return { success: true, favorite: data[0] };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { success: false, error };
  }
}

// Remove a property from favorites
export async function removeFromFavorites(userId: string, propertyId: string) {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);
    
    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { success: false, error };
  }
}

// Check if a property is in user's favorites
export async function isPropertyFavorited(userId: string, propertyId: string) {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      throw error;
    }
    
    return { success: true, isFavorited: !!data };
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { success: false, error };
  }
}