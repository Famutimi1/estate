import { prisma } from '../prisma';
import { User as PrismaUser, UserRole } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export type User = Omit<PrismaUser, 'password'>;

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate a JWT token for a user
function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify a JWT token and return the userId
export function verifyToken(token: string): string | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded.userId;
    } catch {
        return null;
    }
}

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
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: { message: 'User with this email already exists' } };
        }

        // Hash the password
        const hashedPassword = await bcryptjs.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role as UserRole,
            },
        });

        const token = generateToken(user.id);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        void _;

        return { success: true, user: userWithoutPassword, token };
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
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return { success: false, error: { message: 'Invalid email or password' } };
        }

        // Compare password
        const isValid = await bcryptjs.compare(password, user.password);
        if (!isValid) {
            return { success: false, error: { message: 'Invalid email or password' } };
        }

        const token = generateToken(user.id);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        void _;

        return { success: true, user: userWithoutPassword, token };
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, error };
    }
}

// Sign out a user (client-side will clear the token)
export async function signOut() {
    return { success: true };
}

// Get the current user by ID (called from API routes after token verification)
export async function getCurrentUser(userId?: string) {
    try {
        if (!userId) return { user: null };

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) return { user: null };

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        void _;

        return { user: userWithoutPassword };
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
        const data: { name?: string; avatarUrl?: string } = {};
        if (name) data.name = name;
        if (avatar_url) data.avatarUrl = avatar_url;

        const user = await prisma.user.update({
            where: { id },
            data,
        });

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        void _;

        return { success: true, user: userWithoutPassword };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error };
    }
}