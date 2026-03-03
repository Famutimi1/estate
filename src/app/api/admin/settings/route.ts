import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          siteName: 'myHOME',
          siteDescription: 'Find your perfect home from our wide selection of properties.',
          contactEmail: 'admin@myhome.com',
          contactPhone: '+234 800 000 0000',
          address: 'Lagos, Nigeria',
          currency: 'USD',
          propertiesPerPage: 12,
          enableRegistration: true,
          enableFavorites: true,
          maintenanceMode: false,
          metaTitle: 'myHOME - Real Estate Platform',
          metaDescription: 'Discover your dream home with myHOME. Browse luxury properties for sale and rent.',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      address,
      currency,
      propertiesPerPage,
      enableRegistration,
      enableFavorites,
      maintenanceMode,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      linkedinUrl,
      youtubeUrl,
      metaTitle,
      metaDescription,
      googleAnalyticsId,
    } = body;

    let settings = await prisma.adminSettings.findFirst();

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          siteName,
          siteDescription,
          contactEmail,
          contactPhone,
          address,
          currency,
          propertiesPerPage: parseInt(propertiesPerPage),
          enableRegistration,
          enableFavorites,
          maintenanceMode,
          facebookUrl: facebookUrl || null,
          twitterUrl: twitterUrl || null,
          instagramUrl: instagramUrl || null,
          linkedinUrl: linkedinUrl || null,
          youtubeUrl: youtubeUrl || null,
          metaTitle,
          metaDescription,
          googleAnalyticsId: googleAnalyticsId || null,
        },
      });
    } else {
      settings = await prisma.adminSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          siteDescription,
          contactEmail,
          contactPhone,
          address,
          currency,
          propertiesPerPage: parseInt(propertiesPerPage),
          enableRegistration,
          enableFavorites,
          maintenanceMode,
          facebookUrl: facebookUrl || null,
          twitterUrl: twitterUrl || null,
          instagramUrl: instagramUrl || null,
          linkedinUrl: linkedinUrl || null,
          youtubeUrl: youtubeUrl || null,
          metaTitle,
          metaDescription,
          googleAnalyticsId: googleAnalyticsId || null,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
