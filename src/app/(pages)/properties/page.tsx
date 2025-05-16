"use client"

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getProperties, Property } from '@/lib/services/properties';
// import { Pagination } from '@/components/Pagination';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faBed, faBath, faRulerCombined, faMapMarkerAlt, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
// import { addToFavorites, removeFromFavorites, isPropertyFavorited } from '@/lib/services/favorites';
// import { getCurrentUser } from '@/lib/services/auth';

const PropertiesPage = () => {
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertyStatus, setPropertyStatus] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [bathrooms, setBathrooms] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewType, setViewType] = useState<string>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalProperties, setTotalProperties] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const propertiesPerPage = 6;

  // Fetch properties on initial load and when filters change
  const fetchProperties = useCallback(async (searchFilters?: boolean) => {
    try {
      setIsLoading(true);
      // If this is a new search, reset to first page
      // *before* calling fetchProperties.
      // For now, let's keep it and ensure currentPage is a dependency.
      let pageToFetch = currentPage;
      if (searchFilters) {
        // Note: setCurrentPage is async. The `currentPage` value used below
        // will be the one from the render `fetchProperties` was created in.
        // This is a common pitfall.
        setCurrentPage(1);
        pageToFetch = 1; // Use the intended page number for *this* fetch
      }

      const filters = {
        propertyType: propertyType || undefined,
        propertyStatus: propertyStatus || undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
        location: location || undefined,
        bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
        bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
        sortBy: sortBy,
        page: pageToFetch, // Use the determined pageToFetch
        limit: propertiesPerPage
      };

      // Assuming getProperties is an async function that returns { properties: [], total: 0 }
      const result = await getProperties(filters); // If getProperties is not stable, add it to deps
      setProperties(result.properties);
      setTotalProperties(result.total);
    } catch (error) {
      console.error('Error fetching properties:', error);
      // Potentially set an error state here
    } finally {
      setIsLoading(false);
    }
  }, [
    // React state setters (setIsLoading, setCurrentPage, etc.) are stable and don't need to be here.
    propertyType,
    propertyStatus,
    minPrice,
    maxPrice,
    location,
    bedrooms,
    bathrooms,
    sortBy,
    currentPage, // Important: fetchProperties reads this
    propertiesPerPage,
    // getProperties, // Add if getProperties is a prop or can change
    // We don't need setProperties, setTotalProperties, setIsLoading, setCurrentPage in the array
    // because they are guaranteed to be stable by React.
  ]);

  useEffect(() => {
    fetchProperties();
  }, [currentPage, sortBy, fetchProperties  ]);

  
  // Array of mock properties for fallback if needed
  // const mockProperties = [
  //   {
  //     id: "modern-villa",
  //     title: "Modern Luxury Villa",
  //     price: "$649,000",
  //     status: "FOR SALE",
  //     address: "Banana Island Road, Ikoyi, Lagos",
  //     description: "This stunning modern villa offers luxurious living with high-end finishes throughout.",
  //     bedrooms: 4,
  //     bathrooms: 3,
  //     area: "2,450 sqft",
  //     image: "https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=800&height=500&seq=2&orientation=landscape",
  //   },
  //   {
  //     id: "contemporary-villa",
  //     title: "Contemporary Villa",
  //     price: "$685,000",
  //     status: "FOR SALE",
  //     address: "Lekki Phase 1, Lagos",
  //     description: "A beautiful contemporary villa with modern amenities and stunning views.",
  //     bedrooms: 4,
  //     bathrooms: 3,
  //     area: "2,650 sqft",
  //     image: "https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=600&height=400&seq=12&orientation=landscape",
  //   },
  //   {
  //     id: "waterfront-mansion",
  //     title: "Waterfront Mansion",
  //     price: "$1,150,000",
  //     status: "FOR SALE",
  //     address: "Banana Island, Ikoyi, Lagos",
  //     description: "Luxurious waterfront mansion with private dock and panoramic ocean views.",
  //     bedrooms: 5,
  //     bathrooms: 4,
  //     area: "3,800 sqft",
  //     image: "https://readdy.ai/api/search-image?query=Luxury%2520waterfront%2520property%2520with%2520modern%2520architecture%252C%2520floor%2520to%2520ceiling%2520windows%252C%2520infinity%2520pool%252C%2520ocean%2520view%252C%2520sunset%2520lighting%252C%2520high-end%2520real%2520estate%2520photography%252C%2520exclusive%2520beachfront%2520residence&width=600&height=400&seq=13&orientation=landscape",
  //   },
  //   {
  //     id: "luxury-penthouse",
  //     title: "Luxury Penthouse",
  //     price: "$3,500/mo",
  //     status: "FOR RENT",
  //     address: "Victoria Island, Lagos",
  //     description: "Stunning penthouse apartment with panoramic city views and luxury finishes.",
  //     bedrooms: 3,
  //     bathrooms: 3,
  //     area: "2,200 sqft",
  //     image: "https://readdy.ai/api/search-image?query=Modern%2520apartment%2520building%2520exterior%252C%2520contemporary%2520urban%2520architecture%252C%2520glass%2520and%2520steel%2520facade%252C%2520luxury%2520condominium%252C%2520professional%2520real%2520estate%2520photography%252C%2520blue%2520sky%2520background%252C%2520upscale%2520city%2520living&width=600&height=400&seq=14&orientation=landscape",
  //   },
  //   {
  //     id: "family-home",
  //     title: "Spacious Family Home",
  //     price: "$420,000",
  //     status: "FOR SALE",
  //     address: "Ikeja GRA, Lagos",
  //     description: "Perfect family home with large garden, modern kitchen, and spacious living areas.",
  //     bedrooms: 4,
  //     bathrooms: 3,
  //     area: "2,800 sqft",
  //     image: "https://readdy.ai/api/search-image?query=Beautiful%2520suburban%2520family%2520home%2520with%2520garden%252C%2520modern%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520bright%2520daylight%252C%2520well-maintained%2520property&width=600&height=400&seq=15&orientation=landscape",
  //   },
  //   {
  //     id: "garden-apartment",
  //     title: "Garden Apartment",
  //     price: "$1,800/mo",
  //     status: "FOR RENT",
  //     address: "Oniru Estate, Lagos",
  //     description: "Charming garden apartment with private patio, modern finishes, and secure parking.",
  //     bedrooms: 2,
  //     bathrooms: 2,
  //     area: "1,200 sqft",
  //     image: "https://readdy.ai/api/search-image?query=Modern%2520apartment%2520with%2520garden%2520view%252C%2520contemporary%2520design%252C%2520bright%2520interior%252C%2520open%2520concept%2520living%252C%2520professional%2520real%2520estate%2520photography&width=600&height=400&seq=16&orientation=landscape",
  //   },
  // ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProperties(true);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      {/* Page Header */}
      <div className="bg-blue-700 py-16 px-6">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Browse Properties</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Find your perfect home from our wide selection of properties across Nigeria.
          </p>
        </div>
      </div>

      {/* Search Filters */}
      <div className="bg-white shadow-md -mt-8 mb-8 mx-6 lg:mx-auto max-w-6xl rounded-sm">
        <form onSubmit={handleSearch} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property-type">
                Property Type
              </label>
              <select
                id="property-type"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property-status">
                Status
              </label>
              <select
                id="property-status"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={propertyStatus}
                onChange={(e) => setPropertyStatus(e.target.value)}
              >
                <option value="">Any Status</option>
                <option value="for-sale">For Sale</option>
                <option value="for-rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="min-price">
                Min Price
              </label>
              <select
                id="min-price"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              >
                <option value="">No Min</option>
                <option value="100000">$100,000</option>
                <option value="200000">$200,000</option>
                <option value="300000">$300,000</option>
                <option value="500000">$500,000</option>
                <option value="1000000">$1,000,000</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="max-price">
                Max Price
              </label>
              <select
                id="max-price"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">No Max</option>
                <option value="300000">$300,000</option>
                <option value="500000">$500,000</option>
                <option value="750000">$750,000</option>
                <option value="1000000">$1,000,000</option>
                <option value="2000000">$2,000,000+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                Location
              </label>
              <select
                id="location"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              >
                <option value="">Any Location</option>
                <option value="ikoyi">Ikoyi</option>
                <option value="lekki">Lekki</option>
                <option value="vi">Victoria Island</option>
                <option value="ikeja">Ikeja</option>
                <option value="ajah">Ajah</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rooms">
                Bedrooms
              </label>
              <select
                id="bedrooms"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bathrooms">
                Bathrooms
              </label>
              <select
                id="bathrooms"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-700 text-white px-8 py-3 rounded-sm hover:bg-blue-800 transition-colors duration-200"
            >
              Search Properties
            </button>
          </div>
        </form>
      </div>

      {/* Properties List */}
      <div className="container mx-auto px-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            Showing <span className="font-bold">{isLoading ? '...' : properties.length}</span> of <span className="font-bold">{totalProperties}</span> properties
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-gray-600 mr-2 text-sm">Sort by:</label>
              <select
                className="border border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div className="flex border border-gray-300 rounded-sm">
              <button
                className={`px-3 py-1 ${viewType === 'grid' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600'}`}
                onClick={() => setViewType('grid')}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                className={`px-3 py-1 ${viewType === 'list' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600'}`}
                onClick={() => setViewType('list')}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-xl font-semibold text-gray-700">No properties found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search filters</p>
          </div>
        ) : viewType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/properties/${property.id}`}>
                  <div className="relative">
                    <Image
                      src={property.image_url.trimEnd()}
                      width={600} 
                      height={400} 
                      alt={property.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                      {property.property_status}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
                      <div className="text-xl font-bold text-blue-700">#{property.price.toLocaleString()}</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-700" />
                      {property.address}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{property.description}</p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-700" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-700" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-700" />
                        <span>{property.area} {property.area_unit}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <Link href={`/properties/${property.id}`}>
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-1/3">
                      <Image
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                        {property.property_status}
                      </div>
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800">{property.title}</h3>
                        <div className="text-xl font-bold text-blue-700">#{property.price.toLocaleString()}</div>
                      </div>
                      <p className="text-gray-600 mb-4">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-700" />
                        {property.address}
                      </p>
                      <p className="text-gray-700 mb-4">{property.description}</p>
                      <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                        <div className="flex items-center">
                          <i className="fas fa-bed mr-2 text-blue-700"></i>
                          <span>{property.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-bath mr-2 text-blue-700"></i>
                          <span>{property.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-ruler-combined mr-2 text-blue-700"></i>
                          <span>{property.area} {property.area_unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalProperties > propertiesPerPage && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center">
              <button 
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 mx-1 border rounded-sm ${currentPage === 1 ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
              
              {Array.from({ length: Math.ceil(totalProperties / propertiesPerPage) }, (_, i) => i + 1)
                .filter(page => {
                  // Show current page, first and last pages, and pages around current page
                  const maxPages = 5;
                  const totalPages = Math.ceil(totalProperties / propertiesPerPage);
                  if (totalPages <= maxPages) return true;
                  
                  const isCurrentPage = page === currentPage;
                  const isFirstPage = page === 1;
                  const isLastPage = page === totalPages;
                  const isNearCurrentPage = Math.abs(page - currentPage) <= 1;
                  
                  return isCurrentPage || isFirstPage || isLastPage || isNearCurrentPage;
                })
                .map((page, index, array) => {
                  // Add ellipsis where pages are skipped
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-4 py-2 mx-1">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 mx-1 border rounded-sm ${currentPage === page ? 'border-blue-700 bg-blue-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
              
              <button 
                onClick={() => currentPage < Math.ceil(totalProperties / propertiesPerPage) && handlePageChange(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalProperties / propertiesPerPage)}
                className={`px-4 py-2 mx-1 border rounded-sm ${currentPage >= Math.ceil(totalProperties / propertiesPerPage) ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </nav>
          </div>
        )}
      </div>

    </div>
  );
};

export default PropertiesPage;


  

