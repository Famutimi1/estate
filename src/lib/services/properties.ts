import { prisma } from '../prisma';
import { Prisma, Property as PrismaProperty, PropertyStatus, PropertyType, Status } from '@prisma/client';

export type Property = Omit<PrismaProperty, 'price' | 'area'> & {
  price: number;
  area: number;
};

function serializeProperty(p: PrismaProperty): Property {
  return {
    ...p,
    price: Number(p.price),
    area: Number(p.area),
  } as Property;
}

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
  try {
    const where: Prisma.PropertyWhereInput = {
      status: Status.publish, // Only show published properties on frontend
    };

    if (filters) {
      if (filters.propertyType) {
        where.propertyType = filters.propertyType as PropertyType;
      }

      if (filters.propertyStatus) {
        const ps = filters.propertyStatus.toLowerCase();
        where.propertyStatus = (ps === 'for-sale' || ps === 'sale') ? PropertyStatus.ForSale : PropertyStatus.ForRent;
      }

      if (filters.minPrice) {
        where.price = { ...(where.price as Prisma.DecimalFilter || {}), gte: filters.minPrice };
      }

      if (filters.maxPrice) {
        where.price = { ...(where.price as Prisma.DecimalFilter || {}), lte: filters.maxPrice };
      }

      if (filters.location) {
        where.OR = [
          { location: { contains: filters.location, mode: 'insensitive' } },
          { address: { contains: filters.location, mode: 'insensitive' } },
          { city: { contains: filters.location, mode: 'insensitive' } },
          { state: { contains: filters.location, mode: 'insensitive' } },
        ];
      }

      if (filters.bedrooms) {
        where.bedrooms = { gte: filters.bedrooms };
      }

      if (filters.bathrooms) {
        where.bathrooms = { gte: filters.bathrooms };
      }
    }

    // Determine sorting
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'popular':
          orderBy = { createdAt: 'desc' }; // TODO: replace with view/favorite count when available
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 100;
    const skip = (page - 1) * limit;

    // Execute both queries in parallel
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties: properties.map(serializeProperty),
      total,
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], total: 0 };
  }
}

export async function getPropertyById(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { 
        id,
        status: Status.publish, // Only return published properties on frontend
      },
    });

    if (!property) return null;
    return serializeProperty(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Admin function to get any property by ID (including drafts)
export async function getPropertyByIdAdmin(id: string) {
  try {
    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) return null;
    return serializeProperty(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return null;
  }
}

// Admin function to get all properties (including drafts)
export async function getPropertiesAdmin(filters?: {
  propertyType?: string;
  propertyStatus?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const where: Prisma.PropertyWhereInput = {};

    if (filters) {
      if (filters.propertyType) {
        where.propertyType = filters.propertyType as PropertyType;
      }

      if (filters.propertyStatus) {
        const ps = filters.propertyStatus.toLowerCase();
        where.propertyStatus = (ps === 'for-sale' || ps === 'sale') ? PropertyStatus.ForSale : PropertyStatus.ForRent;
      }

      if (filters.status) {
        where.status = filters.status as Status;
      }

      if (filters.minPrice) {
        where.price = { ...(where.price as Prisma.DecimalFilter || {}), gte: filters.minPrice };
      }

      if (filters.maxPrice) {
        where.price = { ...(where.price as Prisma.DecimalFilter || {}), lte: filters.maxPrice };
      }

      if (filters.location) {
        where.OR = [
          { location: { contains: filters.location, mode: 'insensitive' } },
          { address: { contains: filters.location, mode: 'insensitive' } },
          { city: { contains: filters.location, mode: 'insensitive' } },
          { state: { contains: filters.location, mode: 'insensitive' } },
        ];
      }

      if (filters.bedrooms) {
        where.bedrooms = { gte: filters.bedrooms };
      }

      if (filters.bathrooms) {
        where.bathrooms = { gte: filters.bathrooms };
      }
    }

    // Determine sorting
    let orderBy: Prisma.PropertyOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          orderBy = { createdAt: 'desc' };
          break;
        case 'price-asc':
          orderBy = { price: 'asc' };
          break;
        case 'price-desc':
          orderBy = { price: 'desc' };
          break;
        case 'popular':
          orderBy = { createdAt: 'desc' };
          break;
        default:
          orderBy = { createdAt: 'desc' };
      }
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 100;
    const skip = (page - 1) * limit;

    // Execute both queries in parallel
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.property.count({ where }),
    ]);

    return {
      properties: properties.map(serializeProperty),
      total,
    };
  } catch (error) {
    console.error('Error fetching properties:', error);
    return { properties: [], total: 0 };
  }
}

export async function createProperty(data: {
  title: string;
  price: number;
  status?: string;
  property_status: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_unit: string;
  property_type: string;
  location: string;
  image_url: string;
  images?: string[];
  featured_image_index?: number;
  city: string;
  state: string;
  zip_code: string;
  garage_spaces?: number;
  video_url?: string | null;
  brochure_url?: string | null;
  floor_plan_url?: string | null;
  amenities?: Record<string, boolean>;
  user_id?: string;
}) {
  try {
    if (!data.title || !data.price || !data.property_status ||
        !data.address || !data.description ||
        !data.property_type || !data.location || !data.image_url ||
        !data.city || !data.state || !data.zip_code) {
      console.error('Missing required property fields');
      return null;
    }

    const propertyStatus = data.property_status === 'for-sale' || data.property_status === 'For Sale'
      ? PropertyStatus.ForSale
      : PropertyStatus.ForRent;

    const property = await prisma.property.create({
      data: {
        title: data.title,
        price: data.price,
        status: (data.status as 'draft' | 'publish') || 'draft',
        propertyStatus,
        address: data.address,
        description: data.description,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        areaUnit: data.area_unit,
        propertyType: data.property_type as PropertyType,
        location: data.location,
        imageUrl: data.image_url,
        images: data.images || [],
        featuredImageIndex: data.featured_image_index ?? null,
        city: data.city,
        state: data.state,
        zipCode: data.zip_code,
        garageSpaces: data.garage_spaces ?? null,
        videoUrl: data.video_url ?? null,
        brochureUrl: data.brochure_url ?? null,
        floorPlanUrl: data.floor_plan_url ?? null,
        amenities: data.amenities ?? Prisma.JsonNull,
        userId: data.user_id ?? null,
      },
    });

    return serializeProperty(property);
  } catch (err) {
    console.error('Exception in createProperty:', err);
    return null;
  }
}

export async function updateProperty(
  id: string,
  updates: Record<string, unknown>
) {
  try {
    // Map snake_case keys from frontend to camelCase Prisma fields
    const data: Prisma.PropertyUpdateInput = {};
    if (updates.title !== undefined) data.title = updates.title as string;
    if (updates.price !== undefined) data.price = updates.price as number;
    if (updates.status !== undefined) data.status = updates.status as 'draft' | 'publish';
    if (updates.property_status !== undefined) {
      const ps = updates.property_status as string;
      data.propertyStatus = ps === 'for-sale' || ps === 'For Sale' ? PropertyStatus.ForSale : PropertyStatus.ForRent;
    }
    if (updates.address !== undefined) data.address = updates.address as string;
    if (updates.description !== undefined) data.description = updates.description as string;
    if (updates.bedrooms !== undefined) data.bedrooms = updates.bedrooms as number;
    if (updates.bathrooms !== undefined) data.bathrooms = updates.bathrooms as number;
    if (updates.area !== undefined) data.area = updates.area as number;
    if (updates.area_unit !== undefined) data.areaUnit = updates.area_unit as string;
    if (updates.property_type !== undefined) data.propertyType = updates.property_type as PropertyType;
    if (updates.location !== undefined) data.location = updates.location as string;
    if (updates.image_url !== undefined) data.imageUrl = updates.image_url as string;
    if (updates.images !== undefined) data.images = updates.images as string[];
    if (updates.featured_image_index !== undefined) data.featuredImageIndex = updates.featured_image_index as number;
    if (updates.city !== undefined) data.city = updates.city as string;
    if (updates.state !== undefined) data.state = updates.state as string;
    if (updates.zip_code !== undefined) data.zipCode = updates.zip_code as string;
    if (updates.garage_spaces !== undefined) data.garageSpaces = updates.garage_spaces as number;
    if (updates.video_url !== undefined) data.videoUrl = updates.video_url as string | null;
    if (updates.brochure_url !== undefined) data.brochureUrl = updates.brochure_url as string | null;
    if (updates.floor_plan_url !== undefined) data.floorPlanUrl = updates.floor_plan_url as string | null;
    if (updates.amenities !== undefined) data.amenities = updates.amenities as Prisma.InputJsonValue;
    if (updates.user_id !== undefined) data.user = { connect: { id: updates.user_id as string } };

    const property = await prisma.property.update({
      where: { id },
      data,
    });

    return serializeProperty(property);
  } catch (error) {
    console.error('Error updating property:', error);
    console.error('Property ID:', id);
    return null;
  }
}

export async function deleteProperty(id: string) {
  try {
    await prisma.property.delete({ where: { id } });
    return true;
  } catch (error) {
    console.error('Error deleting property:', error);
    return false;
  }
}