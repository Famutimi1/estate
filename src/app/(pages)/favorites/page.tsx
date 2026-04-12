"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Property } from "@/lib/api";

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/favorites?userId=${user?.id}`);
      const result = await response.json();

      if (result.success) {
        // Extract properties from favorites
        const properties = result.favorites.map((fav: any) => fav.property);
        setFavorites(properties);
      } else {
        setError("Failed to fetch favorites");
      }
    } catch (err) {
      setError("Error loading favorites");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, status: string) => {
    return `₦${price.toLocaleString()}${status === "For Rent" ? "/mo" : ""}`;
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-red-600 text-center">
          <p>{error}</p>
          <button 
            onClick={fetchFavorites}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Saved homes</p>
          <h1 className="text-3xl font-bold text-gray-900">Favorites</h1>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">Start exploring and save properties you love!</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
          >
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="block rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row">
                {/* Property Image */}
                <div className="relative w-full md:w-64 h-48 md:h-auto">
                  <Image
                    src={(property.image_url || property.imageUrl || '').trimEnd()}
                    alt={property.title}
                    fill
                    className="object-cover rounded-l-lg"
                  />
                  <div className={`absolute top-4 left-4 ${
                    (property.propertyStatus || property.status) === 'For Sale' ? 'bg-green-700' : 'bg-pink-500'
                  } text-white px-3 py-1 text-sm font-semibold rounded`}>
                    {property.propertyStatus || property.status}
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                        {property.propertyStatus || property.status}
                      </p>
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {property.title}
                      </h2>
                      <p className="text-gray-600 text-sm mb-3">
                        {property.address}
                      </p>
                      
                      {/* Property Features */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                          {property.bedrooms} Beds
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                          </svg>
                          {property.bathrooms} Baths
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                          </svg>
                          {property.area} {property.area_unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`text-lg font-bold ${
                        (property.property_status || property.status) === 'For Sale' ? 'text-green-700' : 'text-pink-500'
                      }`}>
                        {formatPrice(property.price, property.property_status || property.status)}
                      </p>
                      <button className="mt-2 rounded-sm border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
