import { prisma } from '../prisma';
import { AdminSettings } from '@prisma/client';

export type Settings = AdminSettings;

// Get settings (returns first record or creates default if none exists)
export async function getSettings(): Promise<Settings | null> {
  try {
    let settings = await prisma.adminSettings.findFirst();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          siteName: 'Estate Management',
          siteDescription: 'Your trusted real estate partner',
          contactEmail: 'contact@estate.com',
          contactPhone: '+234 800 000 0000',
          address: 'Lagos, Nigeria',
          currency: '₦',
          propertiesPerPage: 12,
          enableRegistration: true,
          enableFavorites: true,
          maintenanceMode: false,
          metaTitle: 'Estate Management - Find Your Dream Property',
          metaDescription: 'Browse through our extensive collection of properties for sale and rent.',
        },
      });
    }
    
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

// Update settings
export async function updateSettings(
  id: string,
  data: Partial<Omit<Settings, 'id' | 'updatedAt'>>
): Promise<Settings | null> {
  try {
    const settings = await prisma.adminSettings.update({
      where: { id },
      data,
    });
    
    return settings;
  } catch (error) {
    console.error('Error updating settings:', error);
    return null;
  }
}

// Create settings (only if none exist)
export async function createSettings(
  data: Omit<Settings, 'id' | 'updatedAt'>
): Promise<Settings | null> {
  try {
    // Check if settings already exist
    const existing = await prisma.adminSettings.findFirst();
    if (existing) {
      console.log('Settings already exist, use update instead');
      return existing;
    }
    
    const settings = await prisma.adminSettings.create({
      data,
    });
    
    return settings;
  } catch (error) {
    console.error('Error creating settings:', error);
    return null;
  }
}
