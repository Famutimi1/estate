import { supabase } from '../supabase';
import { Database } from '../database.types';

export type User = Database['public']['Tables']['users']['Row'];

// Register a new user
export async function registerUser({
    name,
    email,
    password,
    role = 'user'
}: {
    name: string;
    email: string;
    password: string;
    role?: 'user' | 'admin' | 'agent';
}) {
    
    try {
        // Register the user with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    role
                }
            }
        });

        if (authError) throw authError;

        console.log('Registering user:', authData.user );

        // Create a record in the users table
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('users')
                .insert({
                    id: authData.user.id,
                    email,
                    name,
                    role,
                    avatar_url: null
                });

            if (profileError) throw profileError;
        }

        return { success: true, user: authData.user };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, error };
    }
}

// Sign in a user
export async function signIn({
    email,
    password
}: {
    email: string;
    password: string;
}) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        return { success: true, user: data.user, session: data.session };
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, error };
    }
}

// Sign out a user
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error };
    }
}

// Get the current user
export async function getCurrentUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { user: null };

        // Get the user profile from the users table
        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;

        return { user: profile };
    } catch (error) {
        console.error('Error getting current user:', error);
        return { user: null, error };
    }
}

// Update user profile
export async function updateUserProfile({
    id,
    name,
    avatar_url
}: {
    id: string;
    name?: string;
    avatar_url?: string;
}) {
    try {
        const updates: any = {};
        if (name) updates.name = name;
        if (avatar_url) updates.avatar_url = avatar_url;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return { success: true, user: data };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error };
    }
}