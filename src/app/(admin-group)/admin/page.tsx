"use client"

// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useRef } from 'react';

const Admin: React.FC = () => {
  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    property_status: '',
    property_type: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    garageSpaces: '',
    amenities: {
      pool: false,
      garden: false,
      airConditioning: false,
      heating: false,
      internet: false,
      parking: false,
      securitySystem: false,
      laundry: false,
      petsAllowed: false,
      furnished: false
    }
  });

  // Image upload state
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [name]: checked
      }
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const imageUrls = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...imageUrls]);

      // Set first image as featured if none selected
      if (featuredImageIndex === null && uploadedImages.length === 0) {
        setFeaturedImageIndex(0);
      }
    }
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      const imageUrls = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...imageUrls]);

      // Set first image as featured if none selected
      if (featuredImageIndex === null && uploadedImages.length === 0) {
        setFeaturedImageIndex(0);
      }
    }
  };

  // Set featured image
  const setAsFeatured = (index: number) => {
    setFeaturedImageIndex(index);
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);

    // Adjust featured image index if needed
    if (featuredImageIndex === index) {
      setFeaturedImageIndex(newImages.length > 0 ? 0 : null);
    } else if (featuredImageIndex !== null && featuredImageIndex > index) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
  };

  // Submit form
  const handleSubmit = async (isDraft: boolean) => {
    try {
      // Validate required fields
      if (!formData.title || !formData.price || !formData.property_status || !formData.property_type ||
        !formData.description || !formData.address || !formData.city ||
        !formData.state || !formData.zipCode) {
        alert('Please fill in all required fields');
        return;
      }

      // Validate that at least one image is uploaded
      if (uploadedImages.length === 0) {
        alert('Please upload at least one property image');
        return;
      }


      const STATUS = {
        DRAFT: 'draft',
        PUBLISH: 'publish',
      } as const;

      const PROPERTY_STATUS = {
        RENT: 'For Rent',
        SALE: 'For Sale',
      } as const;

      const PROPERTY_TYPE = {
         HOUSE: 'house',
        APARTMENT: 'apartment',
        VILLA: 'villa',
        COMMERCIAL: 'commercial',
        LAND: 'land',
      } as const;
      

      // type Status = typeof STATUS[keyof typeof STATUS];

      // Convert form data to match the database schema
      const propertyData = {
        title: formData.title,
        price: parseFloat(formData.price),
        status: isDraft ? STATUS.DRAFT : STATUS.PUBLISH,
        property_status: formData.property_status === 'rent' ? PROPERTY_STATUS.RENT : PROPERTY_STATUS.SALE,
        address: formData.address,
        description: formData.description,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : 0,
        area: formData.area ? parseFloat(formData.area) : 0,
        area_unit: 'sq ft',
        property_type: formData.property_type=== 'apartment'? PROPERTY_TYPE.APARTMENT :
        formData.property_type === 'house'? PROPERTY_TYPE.HOUSE :
        formData.property_type === 'villa'? PROPERTY_TYPE.VILLA :
        formData.property_type === 'commercial'? PROPERTY_TYPE.COMMERCIAL :
        formData.property_type === 'land'? PROPERTY_TYPE.LAND : PROPERTY_TYPE.HOUSE,
        location: `${formData.city}, ${formData.state}`,
        image_url: featuredImageIndex !== null ? uploadedImages[featuredImageIndex] : uploadedImages[0],
        images: uploadedImages,
        featured_image_index: featuredImageIndex,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        garage_spaces: formData.garageSpaces ? parseInt(formData.garageSpaces) : 0,
        amenities: formData.amenities,
        // If you have user authentication, you can add user_id here
        // user_id: currentUser?.id
      };
      

      // Import the createProperty function
      
      const { createProperty } = await import('@/lib/services/properties');
      
      // Send data to the backend
      const result = await createProperty(propertyData);
      console.log(propertyData);

      if (result) {
        // Show success message
        alert(isDraft ? 'Property saved as draft!' : 'Property published successfully!');

        // Reset form after successful submission
        setFormData({
          title: '',
          description: '',
          price: '',
          property_status: '',
          property_type: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          bedrooms: '',
          bathrooms: '',
          area: '',
          garageSpaces: '',
          amenities: {
            pool: false,
            garden: false,
            airConditioning: false,
            heating: false,
            internet: false,
            parking: false,
            securitySystem: false,
            laundry: false,
            petsAllowed: false,
            furnished: false
          }
        });
        setUploadedImages([]);
        setFeaturedImageIndex(null);
      } else {
        alert('Error creating property. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('An error occurred while submitting the property. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className={`bg-white shadow-lg z-20 transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'} fixed h-full`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
            <span className={`font-bold text-blue-700 text-xl ${sidebarCollapsed ? 'hidden' : ''}`}>my<span className="text-pink-600">HOME</span></span>
            {sidebarCollapsed && <span className="text-pink-600 text-xl font-bold">m</span>}
          </div>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-gray-500 hover:text-pink-600 cursor-pointer !rounded-button whitespace-nowrap"
          >
            <i className={`fas ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            <li>
              <a href="#" className="flex items-center py-3 px-4 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer">
                <i className="fas fa-home text-lg w-8"></i>
                <span className={`${sidebarCollapsed ? 'hidden' : ''}`}>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center py-3 px-4 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer">
                <i className="fas fa-building text-lg w-8"></i>
                <span className={`${sidebarCollapsed ? 'hidden' : ''}`}>Properties</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center py-3 px-4 bg-pink-50 text-pink-600 border-l-4 border-pink-600 cursor-pointer">
                <i className="fas fa-plus text-lg w-8"></i>
                <span className={`${sidebarCollapsed ? 'hidden' : ''}`}>Add Property</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center py-3 px-4 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer">
                <i className="fas fa-users text-lg w-8"></i>
                <span className={`${sidebarCollapsed ? 'hidden' : ''}`}>Users</span>
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center py-3 px-4 text-gray-600 hover:bg-pink-50 hover:text-pink-600 transition-colors cursor-pointer">
                <i className="fas fa-cog text-lg w-8"></i>
                <span className={`${sidebarCollapsed ? 'hidden' : ''}`}>Settings</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        {/* Top Navigation */}
        <div className="bg-blue-800 text-white shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-blue-700 text-white placeholder-blue-300 border-none rounded-sm py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-blue-300"></i>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-white hover:text-blue-200 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    <i className="fas fa-bell text-xl"></i>
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-sm shadow-lg z-10">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        <a href="#" className="block p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-blue-100 rounded-full p-2">
                              <i className="fas fa-user-plus text-blue-800"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">New user registered</p>
                              <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                            </div>
                          </div>
                        </a>
                        <a href="#" className="block p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                              <i className="fas fa-check text-green-600"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">Property approved</p>
                              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                            </div>
                          </div>
                        </a>
                        <a href="#" className="block p-4 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-pink-100 rounded-full p-2">
                              <i className="fas fa-comment-alt text-pink-600"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">New message received</p>
                              <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="p-2 border-t border-gray-200 text-center">
                        <a href="#" className="text-sm text-blue-600 hover:underline">View all notifications</a>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 cursor-pointer !rounded-button whitespace-nowrap"
                  >
                    <img
                      src="https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520a%2520real%2520estate%2520agent%2520with%2520confident%2520smile%2520business%2520attire%2520neutral%2520background%2520high%2520quality%2520portrait%2520photography%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field%2520professional%2520appearance&width=40&height=40&seq=1&orientation=squarish"
                      alt="User"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>John Doe</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg z-10">
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-user mr-2 text-gray-600"></i>
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-cog mr-2 text-gray-600"></i>
                        Settings
                      </a>
                      <div className="border-t border-gray-100"></div>
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-sign-out-alt mr-2 text-gray-600"></i>
                        Logout
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Add New Property</h1>

          <form>
            {/* Basic Information */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="title">
                    Property Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter property title"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="price">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500">$</span>
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-8 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter price"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="status">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="property_status"
                      name="property_status"
                      value={formData.property_status}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      required
                    >
                      <option value="">Select status</option>
                      <option value="sale">For Sale</option>
                      <option value="rent">For Rent</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="type">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="property_type"
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      required
                    >
                      <option value="">Select type</option>
                      <option value="house">House</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                      <option value="land">Land</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter property description"
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2" htmlFor="address">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter street address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="city">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="state">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="zipCode">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="h-64 bg-gray-200 rounded-sm flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-map-marker-alt text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-500">Map will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Features */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Property Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="bedrooms">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    id="bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of bedrooms"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="bathrooms">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    id="bathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of bathrooms"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="area">
                    Area (sq ft)
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Area in sq ft"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2" htmlFor="garageSpaces">
                    Garage Spaces
                  </label>
                  <input
                    type="number"
                    id="garageSpaces"
                    name="garageSpaces"
                    value={formData.garageSpaces}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Number of garage spaces"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="pool"
                    name="pool"
                    checked={formData.amenities.pool}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="pool" className="ml-2 text-gray-700">Swimming Pool</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="garden"
                    name="garden"
                    checked={formData.amenities.garden}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="garden" className="ml-2 text-gray-700">Garden</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="airConditioning"
                    name="airConditioning"
                    checked={formData.amenities.airConditioning}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="airConditioning" className="ml-2 text-gray-700">Air Conditioning</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="heating"
                    name="heating"
                    checked={formData.amenities.heating}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="heating" className="ml-2 text-gray-700">Heating</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="internet"
                    name="internet"
                    checked={formData.amenities.internet}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="internet" className="ml-2 text-gray-700">Internet</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="parking"
                    name="parking"
                    checked={formData.amenities.parking}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="parking" className="ml-2 text-gray-700">Parking</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="securitySystem"
                    name="securitySystem"
                    checked={formData.amenities.securitySystem}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="securitySystem" className="ml-2 text-gray-700">Security System</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="laundry"
                    name="laundry"
                    checked={formData.amenities.laundry}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="laundry" className="ml-2 text-gray-700">Laundry</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="petsAllowed"
                    name="petsAllowed"
                    checked={formData.amenities.petsAllowed}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="petsAllowed" className="ml-2 text-gray-700">Pets Allowed</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="furnished"
                    name="furnished"
                    checked={formData.amenities.furnished}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="furnished" className="ml-2 text-gray-700">Furnished</label>
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-sm shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Property Images</h2>
              <div
                className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <i className="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Drag & Drop or Click to Upload</h3>
                <p className="text-gray-500 mb-4">Upload high quality images (max 10 files)</p>
                <button
                  type="button"
                  className="bg-blue-800 text-white px-6 py-2 font-semibold hover:bg-blue-900 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                >
                  Browse Files
                </button>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Images</h3>
                  <p className="text-gray-500 mb-3">Select an image to set as featured (main) image</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className={`relative rounded-sm overflow-hidden border-2 ${featuredImageIndex === index ? 'border-pink-600' : 'border-transparent'}`}>
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 cursor-pointer !rounded-button whitespace-nowrap"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAsFeatured(index)}
                            className={`w-full py-1 text-xs font-semibold ${featuredImageIndex === index
                                ? 'bg-pink-600 text-white'
                                : 'bg-white text-gray-800 hover:bg-gray-100'
                              } cursor-pointer !rounded-button whitespace-nowrap`}
                          >
                            {featuredImageIndex === index ? 'Featured' : 'Set as Featured'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="border adjust border-blue-800 text-blue-800 px-6 py-3 font-semibold hover:bg-blue-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="bg-pink-600 adjust text-white px-6 py-3 font-semibold hover:bg-pink-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Publish Property
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Admin;

