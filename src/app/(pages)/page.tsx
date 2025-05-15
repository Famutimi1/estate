"use client"

import Image from "next/image";

// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faMapMarkerAlt, faEnvelope, faCommentAlt, faChevronRight, faChevronDown, faHeart, faShareAlt, faBed, faBath, faRulerCombined, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import '@fortawesome/fontawesome-svg-core/styles.css';
import PropertyListing from '../components/PropertyListing';
import { Property } from '@/lib/services/properties';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertyStatus, setPropertyStatus] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchTrigger, setSearchTrigger] = useState<number>(0);
 
  
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    // Increment the search trigger to cause PropertyListing to fetch new data
    setSearchTrigger(prev => prev + 1);
  };
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top of property listings
    window.scrollTo({
      top: document.getElementById('property-listings')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };
  
  const updateTotalPages = (total: number) => {
    const pages = Math.ceil(total / 100); // 100 items per page
    setTotalPages(pages);
    console.log('Total properties:', total, 'Total pages:', pages);
  };
  
  const handlePropertyClick = (property: Property) => {
    router.push(`/properties/${property.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[600px] overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Luxurious%2520modern%2520suburban%2520house%2520exterior%2520at%2520sunset%2520with%2520warm%2520golden%2520light%252C%2520beautiful%2520architecture%2520with%2520gray%2520siding%2520and%2520stone%2520accents%252C%2520perfectly%2520manicured%2520lawn%252C%2520high-end%2520residential%2520neighborhood%252C%2520professional%2520real%2520estate%2520photography&width=1440&height=600&seq=1&orientation=landscape"
          alt="Luxury Home"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 flex items-center z-10">
          <div className="-mt-115 bg-black bg-opacity-70 opacity-75 md:-mt-70 p-2 max-w-2xl md:ml-10 md:rounded-lg text-white backdrop-blur-sm">
            <div className="text-blue-300 font-medium mb-4">
              DISCOVER YOUR DREAM HOME
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Find Your Perfect Place to Live
            </h2>
            <p className=" hidden md:flex text-xl mb-3 opacity-90">
              Experience luxury living in prime locations. Our curated
              selection of properties offers the perfect blend of comfort and
              sophistication.
            </p>

          </div>
        </div>

        {/* <div className="absolute inset-0 flex flex-col mt-10">
              <div className="container mx-auto px-6">
                <div className="max-w-md bg-gray-900 bg-opacity-80 opacity-90 p-8 text-white">
                  <h2 className="text-4xl font-bold mb-1">1243 Main Avenue</h2>
                  <p className="text-2xl mb-4">Left Town</p>
                  <div className="bg-blue-700 inline-block px-4 py-2 text-white font-bold mb-6">
                    $ 482,900
                  </div>
                  <h3 className="text-5xl font-light mb-8">Find your home</h3>
                </div>
              </div>
            </div> */}
        {/* Slider Navigation */}
        {/* <div className="absolute bottom-1/2 right-4 transform translate-y-1/2">
          <button className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer !rounded-button whitespace-nowrap">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div> */}
      </div>
      {/* Search Filter */}
      <div className="container mx-auto px-6 -mt-60  md:mb-20 relative z-10 opacity-90">
        <form onSubmit={(e) => handleSearch(e)}>
          <div className="bg-white shadow-lg rounded-sm flex flex-wrap">
            <div className="w-full md:w-1/5 p-4 border-r border-gray-200">
              <label className="block text-gray-500 text-sm mb-1">Address</label>
              <input

                type="text"
                placeholder="Enter location"
                className="w-full p-2 border border-grey-500 focus:outline-none text-sm"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/5 p-4 border-r border-gray-200">
              <label className="block  text-gray-500 text-sm mb-1">Property type</label>
              <div className="relative border border-gray-500">
                <select
                  className="w-full p-2 appearance-none border-none focus:outline-none text-sm"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">All types</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/5 p-4 border-r border-gray-200">
              <label className="block text-gray-500 text-sm mb-1">Status</label>
              <div className="relative border border-gray-500">
                <select
                  className="w-full p-2 appearance-none border-none focus:outline-none text-sm"
                  value={propertyStatus}
                  onChange={(e) => setPropertyStatus(e.target.value)}
                >
                  <option value="">Any status</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/5 p-4 border-r border-gray-200">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-gray-500 text-sm mb-1">Min Price</label>
                  <div className="relative border border-gray-500">
                    <select
                      className="w-full p-2 appearance-none border-none focus:outline-none text-sm"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    >
                      <option value="">No min</option>
                      <option value="100000">$100,000</option>
                      <option value="200000">$200,000</option>
                      <option value="300000">$300,000</option>
                      <option value="400000">$400,000</option>
                      <option value="500000">$500,000</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-gray-500 text-sm mb-1">Max Price</label>
                  <div className="relative border border-gray-500">
                    <select
                      className="w-full p-2 appearance-none border-none focus:outline-none text-sm"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    >
                      <option value="">No max</option>
                      <option value="300000">$300,000</option>
                      <option value="500000">$500,000</option>
                      <option value="700000">$700,000</option>
                      <option value="1000000">$1,000,000</option>
                      <option value="1500000">$1,500,000</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/5 p-4">
              <label className="block text-gray-500 text-sm mb-1">Rooms</label>
              <div className="relative border border-gray-500">
                <select
                  className="w-full p-2 appearance-none border-none focus:outline-none text-sm"
                  value={rooms}
                  onChange={(e) => setRooms(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              className="bg-pink-600 text-white px-8 py-3 font-semibold hover:bg-pink-700 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
            >
              SEARCH PROPERTIES
            </button>
          </div>
        </form>
      </div>
      {/* Property Listings */}
      <div className="container mx-auto px-6 py-10 md:py-16" id="property-listings">
        <PropertyListing
          filters={{
            propertyType: propertyType || undefined,
            propertyStatus: propertyStatus || undefined,
            minPrice: minPrice ? parseInt(minPrice) : undefined,
            maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
            location: location || undefined,
            bedrooms: rooms ? parseInt(rooms) : undefined,
            page: currentPage,
            limit: 100
          }}
          searchTrigger={searchTrigger}
          onTotalUpdate={updateTotalPages}
          onPropertyClick={handlePropertyClick}
        />
        
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center gap-2">
              <button 
                className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'} !rounded-button whitespace-nowrap`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="text-gray-600" />
              </button>
              
              {/* Generate page buttons */}
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                // Show pages around current page
                let pageNum = 1;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button 
                    key={pageNum}
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 ${currentPage === pageNum ? 'bg-blue-700 text-white' : 'hover:bg-gray-100'} cursor-pointer !rounded-button whitespace-nowrap`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button 
                className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'} !rounded-button whitespace-nowrap`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
