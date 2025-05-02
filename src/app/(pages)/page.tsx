"use client"

import Image from "next/image";

// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneAlt, faMapMarkerAlt, faEnvelope, faCommentAlt, faChevronRight, faChevronDown, faHeart, faShareAlt, faBed, faBath, faRulerCombined } from '@fortawesome/free-solid-svg-icons';

import '@fortawesome/fontawesome-svg-core/styles.css';

const Home: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>('');
  const [propertyStatus, setPropertyStatus] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [PropertyDetail, setPropertyDetail] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [rooms, setRooms] = useState<string>('');
  const [showListings, setShowListings] = useState<boolean>(true);
  const [showPropertyDetail, setShowPropertyDetail] = useState<boolean>(false);
  const handleSearch = () => {
    setShowListings(true);
  };
  const handlePropertyClick = () => {
    setShowListings(false);
    setShowPropertyDetail(true);
  };
  const handleBackToListings = () => {
    setShowPropertyDetail(false);
    setShowListings(true);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {showPropertyDetail ? (
        <PropertyDetail  />
      ) : (
        <>
          <div className="relative h-[600px] overflow-hidden">
            <img
              src="https://readdy.ai/api/search-image?query=Luxurious%2520modern%2520suburban%2520house%2520exterior%2520at%2520sunset%2520with%2520warm%2520golden%2520light%252C%2520beautiful%2520architecture%2520with%2520gray%2520siding%2520and%2520stone%2520accents%252C%2520perfectly%2520manicured%2520lawn%252C%2520high-end%2520residential%2520neighborhood%252C%2520professional%2520real%2520estate%2520photography&width=1440&height=600&seq=1&orientation=landscape"
              alt="Luxury Home"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 flex items-center z-10">
              <div className="bg-black bg-opacity-70 opacity-75 -mt-70 p-2 max-w-2xl ml-10 rounded-lg text-white backdrop-blur-sm">
                <div className="text-blue-300 font-medium mb-4">
                  DISCOVER YOUR DREAM HOME
                </div>
                <h2 className="text-5xl font-bold mb-4">
                  Find Your Perfect Place to Live
                </h2>
                <p className="text-xl mb-3 opacity-90">
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
            <div className="absolute bottom-1/2 right-4 transform translate-y-1/2">
              <button className="w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center text-white cursor-pointer !rounded-button whitespace-nowrap">
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
          {/* Search Filter */}
          <div className="container mx-auto px-6 -mt-60 mb-20 relative z-10 opacity-90">
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
                className="bg-pink-600 text-white px-8 py-3 font-semibold hover:bg-pink-700 transition-colors duration-200 cursor-pointer !rounded-button whitespace-nowrap"
                onClick={handleSearch}
              >
                SEARCH PROPERTIES
              </button>
            </div>
          </div>
          {/* Property Listings */}
          {showListings && (
            <div className="container mx-auto px-6 py-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Featured Properties</h2>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Sort by:</span>
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-300 rounded-sm px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm">
                      <option>Price (Low to High)</option>
                      <option>Price (High to Low)</option>
                      <option>Newest First</option>
                      <option>Most Popular</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Property Card 1 */}
                <div
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={handlePropertyClick}
                >
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=600&height=400&seq=2&orientation=landscape"
                      alt="Luxury Property"
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                      FOR SALE
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Modern Villa</h3>
                      <div className="text-xl font-bold text-blue-700">$649,000</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
                      Banana Island Road, Ikoyi, Lagos
                    </p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-700" />
                        <span>4 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-700" />
                        <span>3 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-700" />
                        <span>2,450 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Property Card 2 */}
                <div
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={handlePropertyClick}
                >
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Elegant%2520townhouse%2520with%2520brick%2520exterior%252C%2520large%2520windows%252C%2520urban%2520setting%252C%2520professional%2520real%2520estate%2520photography%252C%2520bright%2520daylight%2520shot%252C%2520stylish%2520architecture%252C%2520perfect%2520for%2520city%2520living&width=600&height=400&seq=3&orientation=landscape"
                      alt="Townhouse Property"
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
                      FOR RENT
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Urban Townhouse</h3>
                      <div className="text-xl font-bold text-blue-500">$3,200/mo</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" />
                      Admiralty Way, Lekki Phase 1, Lagos
                    </p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-500" />
                        <span>3 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-500" />
                        <span>2 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-500" />
                        <span>1,850 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Property Card 3 */}
                <div
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={handlePropertyClick}
                >
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Luxury%2520waterfront%2520property%2520with%2520modern%2520architecture%252C%2520floor%2520to%2520ceiling%2520windows%252C%2520infinity%2520pool%252C%2520ocean%2520view%252C%2520sunset%2520lighting%252C%2520high-end%2520real%2520estate%2520photography%252C%2520exclusive%2520beachfront%2520residence&width=600&height=400&seq=4&orientation=landscape"
                      alt="Waterfront Property"
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                      FOR SALE
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Waterfront Estate</h3>
                      <div className="text-xl font-bold text-green-500">$1,250,000</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-700" />
                      Eko Atlantic City, Victoria Island
                    </p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-700" />
                        <span>5 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-700" />
                        <span>4 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-700" />
                        <span>3,800 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Property Card 4 */}
                <div
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={handlePropertyClick}
                >
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Cozy%2520cottage%2520style%2520home%2520with%2520charming%2520exterior%252C%2520white%2520picket%2520fence%252C%2520beautiful%2520garden%252C%2520traditional%2520architecture%252C%2520perfect%2520family%2520home%252C%2520bright%2520daylight%2520photography%252C%2520inviting%2520front%2520porch&width=600&height=400&seq=5&orientation=landscape"
                      alt="Cottage Property"
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                      FOR SALE
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Charming Cottage</h3>
                      <div className="text-xl font-bold text-green-500">$425,000</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-700" />
                      Parkview Estate, Ikoyi, Lagos
                    </p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-700" />
                        <span>3 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-700" />
                        <span>2 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-700" />
                        <span>1,650 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Property Card 5 */}
                <div
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={handlePropertyClick}
                >
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Modern%2520apartment%2520building%2520exterior%252C%2520contemporary%2520urban%2520architecture%252C%2520glass%2520and%2520steel%2520facade%252C%2520luxury%2520condominium%252C%2520professional%2520real%2520estate%2520photography%252C%2520blue%2520sky%2520background%252C%2520upscale%2520city%2520living&width=600&height=400&seq=6&orientation=landscape"
                      alt="Apartment Property"
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
                      FOR RENT
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Luxury Apartment</h3>
                      <div className="text-xl font-bold text-blue-500">$2,800/mo</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" />
                      Osborne Estate, Ikoyi, Lagos
                    </p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-500" />
                        <span>2 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-500" />
                        <span>2 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faRulerCombined} className="mr-2 text-blue-500" />
                        <span>1,200 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Property Card 6 */}
                <div
                  className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={handlePropertyClick}
                >
                  <div className="relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Ranch%2520style%2520single%2520family%2520home%252C%2520expansive%2520property%2520with%2520large%2520yard%252C%2520mature%2520trees%252C%2520country%2520setting%252C%2520professional%2520real%2520estate%2520photography%252C%2520perfect%2520family%2520home%252C%2520warm%2520evening%2520light&width=600&height=400&seq=7&orientation=landscape"
                      alt="Ranch Property"
                      className="w-full h-64 object-cover object-top"
                    />
                    <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
                      FOR SALE
                    </div>
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faHeart} />
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-500 cursor-pointer !rounded-button whitespace-nowrap">
                        <FontAwesomeIcon icon={faShareAlt} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800">Spacious Ranch</h3>
                      <div className="text-xl font-bold text-green-500">$575,000</div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-700" />
                      Oniru Royal Estate, Victoria Island
                    </p>
                    <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBed} className="mr-2 text-blue-700" />
                        <span>4 Beds</span>
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faBath} className="mr-2 text-blue-700" />
                        <span>3 Baths</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-ruler-combined mr-2 text-blue-700"></i>
                        <span>2,800 sqft</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-12">
                <nav className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-chevron-left text-gray-600"></i>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 bg-blue-700 text-white cursor-pointer !rounded-button whitespace-nowrap">1</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">2</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm mr-2 hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">3</button>
                  <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">
                    <i className="fas fa-chevron-right text-gray-600"></i>
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
// Add this PropertyDetail component at the end of the file, before the export default Home
// const PropertyDetail = ({ onBack }: { onBack: () => void }) => {
//   const [activeImage, setActiveImage] = useState(0);

//   // Mock property data
//   const property = {
//     id: "modern-villa",
//     title: "Modern Luxury Villa",
//     price: "$649,000",
//     status: "FOR SALE",
//     address: "Banana Island Road, Ikoyi, Lagos",
//     description: "This stunning modern villa offers luxurious living with high-end finishes throughout. The open floor plan features a gourmet kitchen with top-of-the-line appliances, spacious living areas, and floor-to-ceiling windows that flood the home with natural light. The primary suite includes a spa-like bathroom and walk-in closet. Outside, enjoy the private garden and swimming pool.",
//     features: [
//       "4 Bedrooms",
//       "3 Bathrooms",
//       "2,450 sqft",
//       "Built in 2020",
//       "2 Car Garage",
//       "Swimming Pool",
//       "Garden",
//       "Smart Home System",
//       "Security System",
//       "Central Air Conditioning"
//     ],
//     images: [
//       "https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=800&height=500&seq=2&orientation=landscape",
//       "https://readdy.ai/api/search-image?query=Luxury%2520modern%2520kitchen%2520with%2520island%252C%2520white%2520cabinets%252C%2520marble%2520countertops%252C%2520high-end%2520appliances%252C%2520open%2520concept%252C%2520real%2520estate%2520interior%2520photography&width=800&height=500&seq=8&orientation=landscape",
//       "https://readdy.ai/api/search-image?query=Elegant%2520modern%2520living%2520room%2520with%2520large%2520windows%252C%2520contemporary%2520furniture%252C%2520fireplace%252C%2520high%2520ceilings%252C%2520luxury%2520interior%2520design%252C%2520real%2520estate%2520photography&width=800&height=500&seq=9&orientation=landscape",
//       "https://readdy.ai/api/search-image?query=Luxury%2520master%2520bedroom%2520with%2520king%2520bed%252C%2520elegant%2520decor%252C%2520large%2520windows%252C%2520walk-in%2520closet%252C%2520en-suite%2520bathroom%252C%2520high-end%2520real%2520estate%2520interior%2520photography&width=800&height=500&seq=10&orientation=landscape"
//     ],
//     agent: {
//       name: "Sarah Johnson",
//       phone: "+234 803 456 7890",
//       email: "sarah.johnson@myhome.ng",
//       photo: "https://readdy.ai/api/search-image?query=Professional%2520female%2520real%2520estate%2520agent%2520portrait%252C%2520confident%2520smile%252C%2520business%2520attire%252C%2520corporate%2520headshot%252C%2520neutral%2520background&width=150&height=150&seq=11"
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation */}
//       <div className="bg-white shadow-md">
//         <div className="container mx-auto px-6">
//           <div className="flex justify-between items-center py-4">
//             <h1 className="text-2xl font-bold">
//               <a href="#" className="text-gray-800 hover:text-blue-700">
//                 <span className="text-gray-500">my</span>
//                 <span className="text-gray-700">HOME</span>
//               </a>
//             </h1>
//             <nav className="hidden md:flex space-x-8">
//               <a href="#" className="text-gray-600 hover:text-blue-700">Home</a>
//               <a href="#" className="text-blue-700">Properties</a>
//               <a href="#" className="text-gray-600 hover:text-blue-700">About</a>
//               <a href="#" className="text-gray-600 hover:text-blue-700">Contact</a>
//             </nav>
//             <div className="flex items-center space-x-4">
//               <button className="bg-blue-700 text-white px-4 py-2 rounded-sm hover:bg-blue-800 transition-colors duration-200">
//                 Login
//               </button>
//               <button className="bg-pink-600 text-white px-4 py-2 rounded-sm hover:bg-pink-700 transition-colors duration-200">
//                 Register
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Breadcrumb */}
//       <div className="bg-gray-100 py-3">
//         <div className="container mx-auto px-6">
//           <div className="flex items-center text-sm text-gray-600">
//             <a href="#" className="hover:text-blue-700" onClick={onBack}>Home</a>
//             <span className="mx-2">/</span>
//             <a href="#" className="hover:text-blue-700" onClick={onBack}>Properties</a>
//             <span className="mx-2">/</span>
//             <span className="text-blue-700">{property.title}</span>
//           </div>
//         </div>
//       </div>

//       {/* Property Details */}
//       <div className="container mx-auto px-6 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Left Column - Images and Details */}
//           <div className="w-full lg:w-2/3">
//             {/* Main Image */}
//             <div className="relative h-[500px] mb-4 overflow-hidden rounded-sm">
//               <img
//                 src={property.images[activeImage]}
//                 alt={property.title}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
//                 {property.status}
//               </div>
//             </div>

//             {/* Thumbnail Images */}
//             <div className="grid grid-cols-4 gap-4 mb-8">
//               {property.images.map((image, index) => (
//                 <div 
//                   key={index} 
//                   className={`h-24 cursor-pointer overflow-hidden rounded-sm ${activeImage === index ? 'ring-2 ring-blue-700' : ''}`}
//                   onClick={() => setActiveImage(index)}
//                 >
//                   <img
//                     src={image}
//                     alt={`${property.title} - Image ${index + 1}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* Property Details */}
//             <div className="bg-white p-6 rounded-sm shadow-md mb-8">
//               <h1 className="text-3xl font-bold text-gray-800 mb-2">{property.title}</h1>
//               <p className="text-gray-600 mb-4">
//                 <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
//                 {property.address}
//               </p>
//               <div className="flex items-center mb-6">
//                 <div className="text-2xl font-bold text-blue-700 mr-4">{property.price}</div>
//                 <div className="flex space-x-2">
//                   <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center text-sm">
//                     <i className="far fa-heart mr-1"></i> Save
//                   </button>
//                   <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center text-sm">
//                     <i className="fas fa-share-alt mr-1"></i> Share
//                   </button>
//                   <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full flex items-center text-sm">
//                     <i className="fas fa-print mr-1"></i> Print
//                   </button>
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <div className="flex items-center">
//                   <i className="fas fa-bed text-xl text-blue-700 mr-3"></i>
//                   <div>
//                     <div className="text-sm text-gray-500">Bedrooms</div>
//                     <div className="font-semibold">4</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <i className="fas fa-bath text-xl text-blue-700 mr-3"></i>
//                   <div>
//                     <div className="text-sm text-gray-500">Bathrooms</div>
//                     <div className="font-semibold">3</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   <i className="fas fa-ruler-combined text-xl text-blue-700 mr-3"></i>
//                   <div>
//                     <div className="text-sm text-gray-500">Area</div>
//                     <div className="font-semibold">2,450 sqft</div>
//                   </div>
//                 </div>
//               </div>

//               <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
//               <p className="text-gray-700 mb-6 leading-relaxed">
//                 {property.description}
//               </p>

//               <h2 className="text-xl font-bold text-gray-800 mb-3">Features</h2>
//               <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
//                 {property.features.map((feature, index) => (
//                   <li key={index} className="flex items-center text-gray-700">
//                     <i className="fas fa-check text-green-500 mr-2"></i>
//                     {feature}
//                   </li>
//                 ))}
//               </ul>

//               <h2 className="text-xl font-bold text-gray-800 mb-3">Location</h2>
//               <div className="h-64 bg-gray-200 mb-6 rounded-sm">
//                 {/* Map would go here - using placeholder */}
//                 <div className="w-full h-full flex items-center justify-center text-gray-500">
//                   Interactive Map Would Be Displayed Here
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Agent Info and Contact Form */}
//           <div className="w-full lg:w-1/3">
//             {/* Agent Information */}
//             <div className="bg-white p-6 rounded-sm shadow-md mb-8">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Property Agent</h2>
//               <div className="flex items-center mb-4">
//                 <img
//                   src={property.agent.photo}
//                   alt={property.agent.name}
//                   className="w-16 h-16 rounded-full object-cover mr-4"
//                 />
//                 <div>
//                   <h3 className="font-bold text-gray-800">{property.agent.name}</h3>
//                   <p className="text-gray-600 text-sm">Real Estate Agent</p>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <div className="flex items-center mb-2">
//                   <i className="fas fa-phone-alt text-blue-700 mr-3"></i>
//                   <span className="text-gray-700">{property.agent.phone}</span>
//                 </div>
//                 <div className="flex items-center">
//                   <i className="fas fa-envelope text-blue-700 mr-3"></i>
//                   <span className="text-gray-700">{property.agent.email}</span>
//                 </div>
//               </div>
//               <button className="w-full bg-blue-700 text-white py-3 rounded-sm hover:bg-blue-800 transition-colors duration-200">
//                 View Agent Profile
//               </button>
//             </div>

//             {/* Contact Form */}
//             <div className="bg-white p-6 rounded-sm shadow-md">
//               <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Agent</h2>
//               <form>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
//                     Your Name
//                   </label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     id="name"
//                     type="text"
//                     placeholder="Enter your name"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//                     Email Address
//                   </label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
//                     Phone Number
//                   </label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     id="phone"
//                     type="tel"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
//                     Message
//                   </label>
//                   <textarea
//                     className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     id="message"
//                     rows={4}
//                     placeholder="I'm interested in this property..."
//                   ></textarea>
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full bg-pink-600 text-white py-3 rounded-sm hover:bg-pink-700 transition-colors duration-200"
//                 >
//                   Send Message
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Similar Properties */}
//       <div className="bg-gray-100 py-12">
//         <div className="container mx-auto px-6">
//           <h2 className="text-2xl font-bold text-gray-800 mb-8">Similar Properties</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Similar Property Card 1 */}
//             <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//               <div className="relative">
//                 <img
//                   src="https://readdy.ai/api/search-image?query=Modern%2520luxury%2520home%2520exterior%2520with%2520large%2520windows%252C%2520contemporary%2520architecture%252C%2520professional%2520real%2520estate%2520photography%252C%2520twilight%2520shot%2520with%2520warm%2520interior%2520lights%252C%2520beautiful%2520landscaping%252C%2520high-end%2520residential%2520property&width=600&height=400&seq=12&orientation=landscape"
//                   alt="Similar Property"
//                   className="w-full h-64 object-cover"
//                 />
//                 <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
//                   FOR SALE
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-bold text-gray-800">Contemporary Villa</h3>
//                   <div className="text-xl font-bold text-blue-700">$685,000</div>
//                 </div>
//                 <p className="text-gray-600 mb-4">
//                   <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
//                   Lekki Phase 1, Lagos
//                 </p>
//                 <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
//                   <div className="flex items-center">
//                     <i className="fas fa-bed mr-2 text-blue-700"></i>
//                     <span>4 Beds</span>
//                   </div>
//                   <div className="flex items-center">
//                     <i className="fas fa-bath mr-2 text-blue-700"></i>
//                     <span>3 Baths</span>
//                   </div>
//                   <div className="flex items-center">
//                     <i className="fas fa-ruler-combined mr-2 text-blue-700"></i>
//                     <span>2,650 sqft</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Similar Property Card 2 */}
//             <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//               <div className="relative">
//                 <img
//                   src="https://readdy.ai/api/search-image?query=Luxury%2520waterfront%2520property%2520with%2520modern%2520architecture%252C%2520floor%2520to%2520ceiling%2520windows%252C%2520infinity%2520pool%252C%2520ocean%2520view%252C%2520sunset%2520lighting%252C%2520high-end%2520real%2520estate%2520photography%252C%2520exclusive%2520beachfront%2520residence&width=600&height=400&seq=13&orientation=landscape"
//                   alt="Similar Property"
//                   className="w-full h-64 object-cover"
//                 />
//                 <div className="absolute top-4 left-4 bg-blue-700 text-white px-3 py-1 text-sm font-semibold">
//                   FOR SALE
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-bold text-gray-800">Waterfront Mansion</h3>
//                   <div className="text-xl font-bold text-blue-700">$1,150,000</div>
//                 </div>
//                 <p className="text-gray-600 mb-4">
//                   <i className="fas fa-map-marker-alt mr-2 text-blue-700"></i>
//                   Banana Island, Ikoyi, Lagos
//                 </p>
//                 <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
//                   <div className="flex items-center">
//                     <i className="fas fa-bed mr-2 text-blue-700"></i>
//                     <span>5 Beds</span>
//                   </div>
//                   <div className="flex items-center">
//                     <i className="fas fa-bath mr-2 text-blue-700"></i>
//                     <span>4 Baths</span>
//                   </div>
//                   <div className="flex items-center">
//                     <i className="fas fa-ruler-combined mr-2 text-blue-700"></i>
//                     <span>3,800 sqft</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Similar Property Card 3 */}
//             <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
//               <div className="relative">
//                 <img
//                   src="https://readdy.ai/api/search-image?query=Modern%2520apartment%2520building%2520exterior%252C%2520contemporary%2520urban%2520architecture%252C%2520glass%2520and%2520steel%2520facade%252C%2520luxury%2520condominium%252C%2520professional%2520real%2520estate%2520photography%252C%2520blue%2520sky%2520background%252C%2520upscale%2520city%2520living&width=600&height=400&seq=14&orientation=landscape"
//                   alt="Similar Property"
//                   className="w-full h-64 object-cover"
//                 />
//                 <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 text-sm font-semibold">
//                   FOR RENT
//                 </div>
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-start mb-4">
//                   <h3 className="text-xl font-bold text-gray-800">Luxury Penthouse</h3>
//                   <div className="text-xl font-bold text-blue-500">$3,500/mo</div>
//                 </div>
//                 <p className="text-gray-600 mb-4">
//                   <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
//                   Victoria Island, Lagos
//                 </p>
//                 <div className="flex justify-between text-gray-600 border-t border-gray-200 pt-4">
//                   <div className="flex items-center">
//                     <i className="fas fa-bed mr-2 text-blue-500"></i>
//                     <span>3 Beds</span>
//                   </div>
//                   <div className="flex items-center">
//                     <i className="fas fa-bath mr-2 text-blue-500"></i>
//                     <span>3 Baths</span>
//                   </div>
//                   <div className="flex items-center">
//                     <i className="fas fa-ruler-combined mr-2 text-blue-500"></i>
//                     <span>2,200 sqft</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>



//     </div>
//   );
// };

export default Home;
