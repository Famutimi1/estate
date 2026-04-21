"use client"

import Image from "next/image";

// teal/cyan (teal-600), 

// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useCallback, useMemo, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

import '@fortawesome/fontawesome-svg-core/styles.css';
import PropertyListing from '@/components/PropertyListing';
import { Property } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/hooks/useSettings';

const Home: React.FC = () => {
  const router = useRouter();
  const { settings, loading: settingsLoading } = useSettings();
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertyStatus, setPropertyStatus] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactError, setContactError] = useState('');

  // Tracks submitted filters separately from input state so that
  // typing into a filter field does NOT trigger an automatic fetch.
  const [appliedFilters, setAppliedFilters] = useState<{
    propertyType?: string;
    propertyStatus?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    bedrooms?: number;
  }>({});
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
    setAppliedFilters({
      propertyType: propertyType || undefined,
      propertyStatus: propertyStatus || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      location: location || undefined,
      bedrooms: rooms ? parseInt(rooms) : undefined,
    });
    setSearchTrigger(prev => prev + 1);
  }, [propertyType, propertyStatus, minPrice, maxPrice, location, rooms]);
  
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    // Scroll to top of property listings
    window.scrollTo({
      top: document.getElementById('property-listings')?.offsetTop || 0,
      behavior: 'smooth'
    });
  };
  
  const updateTotalPages = useCallback((total: number) => {
    const pages = Math.ceil(total / 100); // 100 items per page
    setTotalPages(pages);
    console.log('Total properties:', total, 'Total pages:', pages);
  }, []);
  
  const handlePropertyClick = useCallback((property: Property) => {
    router.push(`/properties/${property.id}`);
  }, [router]);

  const listingFilters = useMemo(() => {
    return {
      ...appliedFilters,
      page: currentPage,
      limit: 100,
    };
  }, [appliedFilters, currentPage]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError('');
    setContactSuccess(false);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send message');

      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
    } catch (err: any) {
      setContactError(err.message || 'Failed to send message');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[600px] overflow-hidden">
        <Image
          src="/bg_house.jpeg" alt="Luxury Home"
          width={1440}
          height={600}
          className="w-full h-full object-cover object-top"
        />
        {/* <div className="absolute inset-0 bg-black/40 z-0"></div> */}
        <div className="absolute inset-0 flex items-center z-10">
          <div className="-mt-115 bg-black bg-opacity-70 opacity-75 md:-mt-70 p-2 max-w-2xl md:ml-10 md:rounded-lg text-white backdrop-blur-sm">
            <div className="text-green-300 font-medium mb-4">
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
                    ₦ 482,900
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
                  <option value="commercial">Commercial Land</option>
                  <option value="land">Land</option>
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
                      <option value="100000">₦100,000</option>
                      <option value="200000">₦200,000</option>
                      <option value="300000">₦300,000</option>
                      <option value="400000">₦400,000</option>
                      <option value="500000">₦500,000</option>
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
                      <option value="300000">₦300,000</option>
                      <option value="500000">₦500,000</option>
                      <option value="700000">₦700,000</option>
                      <option value="1000000">₦1,000,000</option>
                      <option value="1500000">₦1,500,000</option>
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
              className="bg-green-600 text-white px-8 py-3 font-semibold hover:bg-green-700 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
            >
              SEARCH PROPERTIES
            </button>
          </div>
        </form>
      </div>
      {/* Property Listings */}
      <div className="container mx-auto px-6 py-10 md:py-16" id="property-listings">
        <PropertyListing
          filters={listingFilters}
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
                    className={`w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 ${currentPage === pageNum ? 'bg-green-700 text-white' : 'hover:bg-gray-100'} cursor-pointer !rounded-button whitespace-nowrap`}
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

      {/* Stats Counter Section */}
      <div className="bg-green-700 py-14">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1,000+</div>
              <div className="text-green-200 text-sm md:text-base">Properties Listed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">1,000+</div>
              <div className="text-green-200 text-sm md:text-base">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-green-200 text-sm md:text-base">Expert Agents</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-green-200 text-sm md:text-base">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Finding your dream property is simple with our streamlined process</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">1</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Search</h3>
              <p className="text-gray-600 text-sm">Browse our extensive collection of properties using advanced filters to narrow down your choices.</p>
              <div className="hidden md:block absolute top-8 left-[67%] w-[80%] border-t-2 border-dashed border-green-200"></div>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">2</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Explore</h3>
              <p className="text-gray-600 text-sm">View detailed property information, high-quality photos, and virtual tours from the comfort of your home.</p>
              <div className="hidden md:block absolute top-8 left-[67%] w-[80%] border-t-2 border-dashed border-pink-200"></div>
            </div>
            <div className="text-center relative">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">3</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Schedule</h3>
              <p className="text-gray-600 text-sm">Book a viewing at your convenience and visit the property with one of our experienced agents.</p>
              <div className="hidden md:block absolute top-8 left-[67%] w-[80%] border-t-2 border-dashed border-green-200"></div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">4</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Move In</h3>
              <p className="text-gray-600 text-sm">Complete the transaction securely and move into your new dream home with full support from our team.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
              <p className="text-gray-600 mb-8">We go beyond just listing properties. Our commitment to excellence and client satisfaction sets us apart in the real estate industry.</p>
              <div className="space-y-5">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-search-location text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Comprehensive Listings</h4>
                    <p className="text-gray-600 text-sm">Access thousands of verified properties with detailed info, photos, and virtual tours.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-hand-holding-usd text-pink-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Best Price Guarantee</h4>
                    <p className="text-gray-600 text-sm">Our market analysis ensures you get the best value whether buying, selling, or renting.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-headset text-green-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">24/7 Support</h4>
                    <p className="text-gray-600 text-sm">Our dedicated team is always available to answer your questions and guide you through the process.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="fas fa-file-contract text-yellow-600"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">Legal Assistance</h4>
                    <p className="text-gray-600 text-sm">Get professional legal support for documentation, contracts, and property verification.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <i className="fas fa-home text-green-600 text-3xl mb-3"></i>
                <div className="text-2xl font-bold text-gray-800">500+</div>
                <div className="text-gray-500 text-sm">Properties Sold</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <i className="fas fa-key text-pink-600 text-3xl mb-3"></i>
                <div className="text-2xl font-bold text-gray-800">1,200+</div>
                <div className="text-gray-500 text-sm">Properties Rented</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <i className="fas fa-map-marker-alt text-green-600 text-3xl mb-3"></i>
                <div className="text-2xl font-bold text-gray-800">50+</div>
                <div className="text-gray-500 text-sm">Neighborhoods</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <i className="fas fa-award text-yellow-600 text-3xl mb-3"></i>
                <div className="text-2xl font-bold text-gray-800">15+</div>
                <div className="text-gray-500 text-sm">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Real stories from real people who found their dream properties with us</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-6 relative">
              <div className="text-pink-600 text-4xl mb-4 leading-none">&ldquo;</div>
              <p className="text-gray-600 mb-6">The team made our home buying experience seamless. From the first viewing to getting the keys, everything was handled professionally. We couldn&apos;t be happier with our new home!</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-bold text-lg mr-3">A</div>
                <div>
                  <div className="font-semibold text-gray-800">Adebayo Johnson</div>
                  <div className="text-sm text-gray-500">Homeowner, Lagos</div>
                </div>
              </div>
              <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="fas fa-star text-yellow-400 text-sm mr-1"></i>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 relative">
              <div className="text-pink-600 text-4xl mb-4 leading-none">&ldquo;</div>
              <p className="text-gray-600 mb-6">As a first-time investor, I was nervous about buying property. The agents here guided me through every step and helped me find a property that has already appreciated in value.</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-700 font-bold text-lg mr-3">C</div>
                <div>
                  <div className="font-semibold text-gray-800">Chioma Okafor</div>
                  <div className="text-sm text-gray-500">Investor, Abuja</div>
                </div>
              </div>
              <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="fas fa-star text-yellow-400 text-sm mr-1"></i>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 relative">
              <div className="text-pink-600 text-4xl mb-4 leading-none">&ldquo;</div>
              <p className="text-gray-600 mb-6">I needed to find a rental quickly for my family relocation. Within a week, they found us the perfect apartment in a great neighborhood with excellent schools nearby.</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-700 font-bold text-lg mr-3">E</div>
                <div>
                  <div className="font-semibold text-gray-800">Emmanuel Nwachukwu</div>
                  <div className="text-sm text-gray-500">Tenant, Abeokuta</div>
                </div>
              </div>
              <div className="flex mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className="fas fa-star text-yellow-400 text-sm mr-1"></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Neighborhoods Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Neighborhoods</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore the most sought-after areas with thriving communities and excellent amenities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {[
              { name: 'Lagos', count: '1,000+ Properties', icon: 'fa-city', color: 'bg-green-600' },
              { name: 'Ogun', count: '400+ Properties', icon: 'fa-building', color: 'bg-green-600' },
              { name: 'Oyo', count: '300+ Properties', icon: 'fa-landmark', color: 'bg-pink-600' },
              { name: 'Abuja', count: '500+ Properties', icon: 'fa-gem', color: 'bg-green-600' },
            ].map((area) => (
              <div 
                key={area.name} 
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-5 cursor-pointer group"
                onClick={() => window.location.href = `/properties?location=${encodeURIComponent(area.name)}`}
              >
                <div className={`w-12 h-12 ${area.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                  <i className={`fas ${area.icon} text-white text-lg`}></i>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{area.name}</h3>
                <p className="text-sm text-gray-500">{area.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">Got questions? We have answers to help you get started</p>
            </div>
            <div className="space-y-4">
              {[
                {
                  q: 'How do I schedule a property viewing?',
                  a: 'Simply find a property you like, click on it to view the details, and use the "Schedule a Viewing" form on the property page. Choose your preferred date and time, and our agent will confirm your appointment.',
                },
                {
                  q: 'Are the property listings verified?',
                  a: 'Yes, every property listed on our platform goes through a thorough verification process. Our team physically inspects properties and verifies ownership documents to ensure authenticity.',
                },
                {
                  q: 'What are the fees for using your service?',
                  a: 'Browsing and searching properties is completely free. Our commission structure is transparent and competitive — we only charge a standard agency fee upon successful completion of a transaction.',
                },
                {
                  q: 'Can I list my property on your platform?',
                  a: 'Absolutely! Property owners and agents can list their properties by creating an account. Our team will review and verify your listing before it goes live to maintain quality standards.',
                },
                {
                  q: 'Do you offer mortgage or financing assistance?',
                  a: 'Yes, we partner with leading financial institutions to help you explore mortgage options and financing plans. Our agents can connect you with the right lender based on your needs.',
                },
              ].map((faq, index) => (
                <details key={index} className="group bg-gray-50 rounded-lg">
                  <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-800 hover:text-green-600 transition-colors">
                    <span>{faq.q}</span>
                    <i className="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform duration-200"></i>
                  </summary>
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-green-700 py-16" id="contact-section">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-start">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch With Us</h2>
              <p className="text-green-200 mb-8 text-lg">Have a question or need help finding the perfect property? Send us a message and our team will get back to you within 24 hours.</p>
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4 bg-green-600/40 rounded-xl px-5 py-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-bolt text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Fast Response</p>
                    <p className="text-green-200 text-xs">We reply to all inquiries within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-green-600/40 rounded-xl px-5 py-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user-tie text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Expert Agents</p>
                    <p className="text-green-200 text-xs">Dedicated professionals guide you every step</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-green-600/40 rounded-xl px-5 py-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-lock text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Confidential & Secure</p>
                    <p className="text-green-200 text-xs">Your information is always safe with us</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-green-600/40 rounded-xl px-5 py-4">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-handshake text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">No-Obligation Consultation</p>
                    <p className="text-green-200 text-xs">Free advice with zero pressure to commit</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Send Us a Message</h3>
              <p className="text-gray-500 text-sm mb-6">Fill out the form below and we&apos;ll respond as soon as possible.</p>

              {contactSuccess && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <i className="fas fa-check-circle text-green-600 mr-3"></i>
                  <span className="text-green-700 text-sm">Your message has been sent successfully! We&apos;ll get back to you soon.</span>
                </div>
              )}
              {contactError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <i className="fas fa-exclamation-circle text-red-600 mr-3"></i>
                  <span className="text-red-700 text-sm">{contactError}</span>
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="w-full bg-green-600 text-white py-3 font-semibold hover:bg-green-700 transition-colors duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactSubmitting ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Message
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-14">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">Join thousands of satisfied clients who found their perfect property through our platform. Start your search today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-green-600 text-white px-8 py-3 font-semibold hover:bg-green-700 transition-colors duration-200 cursor-pointer rounded-sm"
            >
              <i className="fas fa-search mr-2"></i>
              Browse Properties
            </button>
            <button
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200 cursor-pointer rounded-sm"
            >
              <i className="fas fa-envelope mr-2"></i>
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
