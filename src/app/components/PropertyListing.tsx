"use client";

import { useState, useEffect } from 'react';
// import Link from 'next/link';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShareAlt, faBed, faBath, faRulerCombined, faMapMarkerAlt, faChevronLeft, faChevronRight,faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getProperties } from '@/lib/services/properties';
import { addToFavorites, removeFromFavorites, isPropertyFavorited } from '@/lib/services/favorites';
import { getCurrentUser } from '@/lib/services/auth';
import { Property } from '@/lib/services/properties';
import { supabase } from '@/lib/supabase';
import PropertySkeletonLoader from './PropertySkeletonLoader';

interface PropertyListingProps {
  filters?: {
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
  };
  searchTrigger?: number; // Add a trigger that changes when search button is clicked
  onPropertyClick?: (property: Property) => void;
  onTotalUpdate?: (total: number) => void;
}

const PropertyListing: React.FC<PropertyListingProps> = ({ filters, searchTrigger = 0, onPropertyClick, onTotalUpdate }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [authChecked, setAuthChecked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const propertiesPerPage = 100;
  const [sortBy, setSortBy] = useState<string>('newest');
  // Fetch current user

  useEffect(() => {
    const fetchUser = async () => {
      const { user } = await getCurrentUser();
      setCurrentUser(user);
      setAuthChecked(true);
    };

    fetchUser();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { user } = await getCurrentUser();
        setCurrentUser(user);
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
      setAuthChecked(true);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

   
  
  // Don't fetch on filters change, only when searchTrigger changes

  // Fetch properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { properties, total } = await getProperties({
        ...filters,
        sortBy: sortBy,
        page: currentPage,
        limit: propertiesPerPage
      });
      setProperties(properties);
      setTotalProperties(total);
      // Call the onTotalUpdate callback with the total count
      if (onTotalUpdate) {
        onTotalUpdate(total);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }; 

  // Fetch properties on initial load, when search is triggered, or when page/sort changes
  useEffect(() => {
      fetchProperties();
    }, [currentPage, sortBy, searchTrigger,fetchProperties]);
    
  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   fetchProperties();
  // };
 


  // Check favorite status for each property
  useEffect(() => {
    const checkFavorites = async () => {
      if (!currentUser) return;

      const favoritesStatus: Record<string, boolean> = {};

      for (const property of properties) {
        const { isFavorited } = await isPropertyFavorited(currentUser.id, property.id);
        favoritesStatus[property.id] = isFavorited || false;
      }

      setFavorites(favoritesStatus);
    };

    if (currentUser && properties.length > 0) {
      checkFavorites();
    }
  }, [currentUser, properties]);

  const handleFavoriteClick = async (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation(); // Prevent triggering the property click event

    if (!authChecked) return;

    if (!currentUser) {
      alert('Please sign in to add properties to favorites');
      return;
    }

    try {
      const isFavorited = favorites[propertyId];

      if (isFavorited) {
        await removeFromFavorites(currentUser.id, propertyId);
      } else {
        await addToFavorites(currentUser.id, propertyId);
      }

      // Update local state
      setFavorites(prev => ({
        ...prev,
        [propertyId]: !isFavorited
      }));
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  if (loading) {
    return <PropertySkeletonLoader />;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (properties.length === 0) {
    return <div className="text-center py-8">No properties found matching your criteria.</div>;
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8">
          <h2 className="text-xl ml-0 md:text-3xl font-bold text-gray-800">Featured Properties</h2>
          <div className="flex items-center mt-5 md:mt-0">
            <span className=" text-gray-600 mr-2">Sort by:</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-300 rounded-sm px-4 py-2 pr-8 focus:outline-none   text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="popular">Most Popular</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer block"
            onClick={() => {
              if (onPropertyClick) {
                onPropertyClick(property);
              } else {
                window.location.href = `/properties/${property.id}`;
              }
            }}
          >
            <div className="relative">
              <Image
                src={property.image_url}
                alt={property.title}
                className="w-full h-64 object-cover object-top"
              />
              <div className={`absolute top-4 left-4 ${property.property_status === 'For Sale' ? 'bg-blue-700' : 'bg-blue-500'} text-white px-3 py-1 text-sm font-semibold`}>
                {property.property_status}
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button 
                  className={`w-8 h-8 bg-white rounded-full flex items-center justify-center ${favorites[property.id] ? 'text-red-500' : 'text-gray-600 hover:text-red-500'} cursor-pointer !rounded-button whitespace-nowrap`}
                  onClick={(e) => handleFavoriteClick(e, property.id)}
                  aria-label="Add to favorites"
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button 
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Share property"
                >
                  <FontAwesomeIcon icon={faShareAlt} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
                <div className={`text-xl font-bold ${property.property_status === 'For Sale' ? 'text-blue-700' : 'text-blue-500'}`}>
                  #{property.price.toLocaleString()}{property.property_status === 'For Rent' ? '/mo' : ''}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                <FontAwesomeIcon icon={faMapMarkerAlt} className={`mr-2 ${property.property_status === 'For Sale' ? 'text-blue-700' : 'text-blue-500'}`} />
                {property.address}
              </p>
              <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBed} className={`mr-1 md:mr-2 ${property.property_status === 'For Sale' ? 'text-blue-700' : 'text-blue-500'}`} />
                  <span>{property.bedrooms} Beds</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faBath} className={`mr-1 md:mr-2 ${property.property_status === 'For Sale' ? 'text-blue-700' : 'text-blue-500'}`} />
                  <span>{property.bathrooms} Baths</span>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faRulerCombined} className={`mr-1 md:mr-2 ${property.property_status === 'For Sale' ? 'text-blue-700' : 'text-blue-500'}`} />
                  <span>{property.area} {property.area_unit}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 py-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md flex items-center ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
            Previous
          </button>
          
          <div className="flex items-center">
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md flex items-center ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            Next
            <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
          </button>
        </div>
      )}
    </div>
      


    </>
    
  );
};

export default PropertyListing;