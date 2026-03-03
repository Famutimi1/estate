// Client-side API helpers for fetching data from API routes
// These are safe to use in "use client" components

export interface Property {
  id: string;
  createdAt: string;
  title: string;
  price: number;
  status: string;
  propertyStatus: string;
  address: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  propertyType: string;
  location: string;
  imageUrl: string;
  images: string[];
  featuredImageIndex: number | null;
  city: string;
  state: string;
  zipCode: string;
  garageSpaces: number | null;
  amenities: Record<string, boolean> | null;
  userId: string | null;
  // snake_case aliases for backward compatibility with templates
  property_status?: string;
  image_url?: string;
  area_unit?: string;
  property_type?: string;
  zip_code?: string;
  garage_spaces?: number | null;
  featured_image_index?: number | null;
  created_at?: string;
  user_id?: string | null;
}

function normalizeProperty(p: Record<string, unknown>): Property {
  return {
    id: p.id as string,
    createdAt: (p.createdAt ?? p.created_at ?? '') as string,
    title: p.title as string,
    price: Number(p.price),
    status: p.status as string,
    propertyStatus: (p.propertyStatus ?? p.property_status ?? '') as string,
    address: p.address as string,
    description: p.description as string,
    bedrooms: p.bedrooms as number,
    bathrooms: p.bathrooms as number,
    area: Number(p.area),
    areaUnit: (p.areaUnit ?? p.area_unit ?? '') as string,
    propertyType: (p.propertyType ?? p.property_type ?? '') as string,
    location: p.location as string,
    imageUrl: (p.imageUrl ?? p.image_url ?? '') as string,
    images: (p.images ?? []) as string[],
    featuredImageIndex: (p.featuredImageIndex ?? p.featured_image_index ?? null) as number | null,
    city: p.city as string,
    state: p.state as string,
    zipCode: (p.zipCode ?? p.zip_code ?? '') as string,
    garageSpaces: (p.garageSpaces ?? p.garage_spaces ?? null) as number | null,
    amenities: (p.amenities ?? null) as Record<string, boolean> | null,
    userId: (p.userId ?? p.user_id ?? null) as string | null,
    // snake_case aliases
    property_status: (p.propertyStatus ?? p.property_status ?? '') as string,
    image_url: (p.imageUrl ?? p.image_url ?? '') as string,
    area_unit: (p.areaUnit ?? p.area_unit ?? '') as string,
    property_type: (p.propertyType ?? p.property_type ?? '') as string,
    zip_code: (p.zipCode ?? p.zip_code ?? '') as string,
    garage_spaces: (p.garageSpaces ?? p.garage_spaces ?? null) as number | null,
    featured_image_index: (p.featuredImageIndex ?? p.featured_image_index ?? null) as number | null,
    created_at: (p.createdAt ?? p.created_at ?? '') as string,
    user_id: (p.userId ?? p.user_id ?? null) as string | null,
  };
}

export async function fetchProperties(filters?: {
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
}): Promise<{ properties: Property[]; total: number }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
  }

  const res = await fetch(`/api/properties?${params.toString()}`);
  const data = await res.json();
  return {
    properties: (data.properties || []).map((p: Record<string, unknown>) => normalizeProperty(p)),
    total: data.total || 0,
  };
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const res = await fetch(`/api/properties/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.error) return null;
  return normalizeProperty(data);
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAddToFavorites(userId: string, propertyId: string) {
  const res = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ userId, propertyId }),
  });
  return res.json();
}

export async function fetchRemoveFromFavorites(userId: string, propertyId: string) {
  const res = await fetch('/api/favorites', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify({ userId, propertyId }),
  });
  return res.json();
}

export async function fetchIsPropertyFavorited(userId: string, propertyId: string) {
  const params = new URLSearchParams({ userId, propertyId });
  const res = await fetch(`/api/favorites?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return res.json();
}
