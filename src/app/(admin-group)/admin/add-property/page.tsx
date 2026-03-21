"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

type UploadedImage = {
  url: string;
  publicId: string;
};

type AmenitiesState = {
  pool: boolean;
  garden: boolean;
  airConditioning: boolean;
  heating: boolean;
  internet: boolean;
  parking: boolean;
  securitySystem: boolean;
  laundry: boolean;
  petsAllowed: boolean;
  furnished: boolean;
};

const createEmptyAmenities = (): AmenitiesState => ({
  pool: false,
  garden: false,
  airConditioning: false,
  heating: false,
  internet: false,
  parking: false,
  securitySystem: false,
  laundry: false,
  petsAllowed: false,
  furnished: false,
});

const createInitialFormState = () => ({
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
  videoUrl: '',
  brochureUrl: '',
  floorPlanUrl: '',
  amenities: createEmptyAmenities(),
});

const AddPropertyPage: React.FC = () => {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const isEditMode = Boolean(propertyId);

  const [formData, setFormData] = useState(createInitialFormState);

  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);
  const floorPlanInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isUploadingBrochure, setIsUploadingBrochure] = useState(false);
  const [isUploadingFloorPlan, setIsUploadingFloorPlan] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [name]: checked },
    });
  };

  const uploadFilesToCloudinary = async (files: File[]) => {
    if (!files.length) return;
    setIsUploadingImages(true);
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const payload = new FormData();
          payload.append('file', file);
          const response = await fetch('/api/upload', { method: 'POST', body: payload });
          const data = await response.json();
          if (!response.ok || !data.url) throw new Error(data.error || 'Failed to upload image');
          return { url: data.url as string, publicId: data.publicId as string };
        })
      );
      setUploadedImages((prev) => [...prev, ...uploads]);
      setFeaturedImageIndex((prev) => (prev === null && uploads.length > 0 ? 0 : prev));
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      alert('Failed to upload image(s). Please try again.');
    } finally {
      setIsUploadingImages(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await uploadFilesToCloudinary(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingVideo(true);
      try {
        const file = e.target.files[0];
        const payload = new FormData();
        payload.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: payload });
        const data = await response.json();
        if (!response.ok || !data.url) throw new Error(data.error || 'Failed to upload video');
        setFormData((prev) => ({ ...prev, videoUrl: data.url }));
      } catch (error) {
        console.error('Video upload failed:', error);
        alert('Failed to upload video. Please try again.');
      } finally {
        setIsUploadingVideo(false);
        e.target.value = '';
      }
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingBrochure(true);
      try {
        const file = e.target.files[0];
        const payload = new FormData();
        payload.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: payload });
        const data = await response.json();
        if (!response.ok || !data.url) throw new Error(data.error || 'Failed to upload brochure');
        setFormData((prev) => ({ ...prev, brochureUrl: data.url }));
      } catch (error) {
        console.error('Brochure upload failed:', error);
        alert('Failed to upload brochure. Please try again.');
      } finally {
        setIsUploadingBrochure(false);
        e.target.value = '';
      }
    }
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploadingFloorPlan(true);
      try {
        const file = e.target.files[0];
        const payload = new FormData();
        payload.append('file', file);
        const response = await fetch('/api/upload', { method: 'POST', body: payload });
        const data = await response.json();
        if (!response.ok || !data.url) throw new Error(data.error || 'Failed to upload floor plan');
        setFormData((prev) => ({ ...prev, floorPlanUrl: data.url }));
      } catch (error) {
        console.error('Floor plan upload failed:', error);
        alert('Failed to upload floor plan. Please try again.');
      } finally {
        setIsUploadingFloorPlan(false);
        e.target.value = '';
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      await uploadFilesToCloudinary(Array.from(e.dataTransfer.files));
    }
  };

  const setAsFeatured = (index: number) => setFeaturedImageIndex(index);

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      setFeaturedImageIndex((pf) => {
        if (pf === null) return null;
        if (pf === index) return next.length > 0 ? 0 : null;
        if (pf > index) return pf - 1;
        return pf;
      });
      return next;
    });
  };

  useEffect(() => {
    if (!propertyId) {
      setFormData(createInitialFormState());
      setUploadedImages([]);
      setFeaturedImageIndex(null);
      return;
    }

    const fetchProperty = async () => {
      setLoadingProperty(true);
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (!res.ok) throw new Error('Failed to fetch property');
        const property = await res.json();

        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price ? String(property.price) : '',
          property_status: property.propertyStatus === 'ForRent' ? 'rent' : 'sale',
          property_type: property.propertyType || '',
          address: property.address || '',
          city: property.city || '',
          state: property.state || '',
          zipCode: property.zipCode || '',
          bedrooms: property.bedrooms !== undefined ? String(property.bedrooms) : '',
          bathrooms: property.bathrooms !== undefined ? String(property.bathrooms) : '',
          area: property.area !== undefined ? String(property.area) : '',
          garageSpaces: property.garageSpaces !== undefined && property.garageSpaces !== null ? String(property.garageSpaces) : '',
          videoUrl: property.videoUrl || '',
          brochureUrl: property.brochureUrl || '',
          floorPlanUrl: property.floorPlanUrl || '',
          amenities: { ...createEmptyAmenities(), ...(property.amenities || {}) },
        });

        const gallery: string[] = property.images?.length ? property.images : property.imageUrl ? [property.imageUrl] : [];
        setUploadedImages(gallery.map((url: string, idx: number) => ({ url, publicId: `existing-${idx}` })));
        setFeaturedImageIndex(
          property.featuredImageIndex !== undefined && property.featuredImageIndex !== null
            ? property.featuredImageIndex
            : gallery.length > 0
              ? 0
              : null
        );
      } catch (err) {
        console.error('Failed to load property data:', err);
        alert('Failed to load property for editing. Please try again.');
      } finally {
        setLoadingProperty(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleSubmit = async (isDraft: boolean) => {
    try {
      if (
        !formData.title || !formData.price || !formData.property_status || !formData.property_type ||
        !formData.description || !formData.address || !formData.city || !formData.state || !formData.zipCode
      ) {
        alert('Please fill in all required fields');
        return;
      }
      if (isUploadingImages) {
        alert('Please wait for image uploads to finish.');
        return;
      }
      if (uploadedImages.length === 0) {
        alert('Please upload at least one property image');
        return;
      }

      const STATUS = { DRAFT: 'draft', PUBLISH: 'publish' } as const;
      const PROPERTY_STATUS = { RENT: 'For Rent', SALE: 'For Sale' } as const;
      const PROPERTY_TYPE = { HOUSE: 'house', APARTMENT: 'apartment', VILLA: 'villa', COMMERCIAL: 'commercial', LAND: 'land' } as const;

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
        property_type:
          formData.property_type === 'apartment' ? PROPERTY_TYPE.APARTMENT :
          formData.property_type === 'villa' ? PROPERTY_TYPE.VILLA :
          formData.property_type === 'commercial' ? PROPERTY_TYPE.COMMERCIAL :
          formData.property_type === 'land' ? PROPERTY_TYPE.LAND : PROPERTY_TYPE.HOUSE,
        location: `${formData.city}, ${formData.state}`,
        image_url: uploadedImages[featuredImageIndex ?? 0]?.url,
        images: uploadedImages.map((img) => img.url),
        featured_image_index: featuredImageIndex,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        garage_spaces: formData.garageSpaces ? parseInt(formData.garageSpaces) : 0,
        video_url: formData.videoUrl || null,
        brochure_url: formData.brochureUrl || null,
        floor_plan_url: formData.floorPlanUrl || null,
        amenities: formData.amenities,
      };

      const endpoint = isEditMode && propertyId ? `/api/properties/${propertyId}` : '/api/properties';
      const method = isEditMode && propertyId ? 'PUT' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      const result = await res.json();

      if (result && !result.error) {
        if (isEditMode) {
          alert(isDraft ? 'Property saved as draft!' : 'Property updated successfully!');
        } else {
          alert(isDraft ? 'Property saved as draft!' : 'Property published successfully!');
          setFormData(createInitialFormState());
          setUploadedImages([]);
          setFeaturedImageIndex(null);
        }
      } else {
        alert('Error creating property. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting property:', error);
      alert('An error occurred while submitting the property. Please try again.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{isEditMode ? 'Edit Property' : 'Add New Property'}</h1>
          {isEditMode && propertyId && (
            <p className="text-sm text-gray-500 mt-1">Editing property ID: {propertyId}</p>
          )}
        </div>
      </div>

      {isEditMode && loadingProperty ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6 text-center text-gray-500">
          Loading property details...
        </div>
      ) : (
        <form>
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="title">Property Title <span className="text-red-500">*</span></label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter property title" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="price">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₦</span>
                  <input type="text" id="price" name="price" value={formData.price} onChange={handleInputChange}
                    className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter price" required />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="property_status">Status <span className="text-red-500">*</span></label>
                <select id="property_status" name="property_status" value={formData.property_status} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select status</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="property_type">Property Type <span className="text-red-500">*</span></label>
                <select id="property_type" name="property_type" value={formData.property_type} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select type</option>
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="commercial">Commercial Land</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" htmlFor="description">Description <span className="text-red-500">*</span></label>
                <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} rows={5}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter property description" required />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2" htmlFor="address">Address <span className="text-red-500">*</span></label>
                <input type="text" id="address" name="address" value={formData.address} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter street address" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="city">City <span className="text-red-500">*</span></label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter city" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="state">State <span className="text-red-500">*</span></label>
                <input type="text" id="state" name="state" value={formData.state} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter state" required />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="zipCode">ZIP Code <span className="text-red-500">*</span></label>
                <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter ZIP code" required />
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Property Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="bedrooms">Bedrooms</label>
                <input type="number" id="bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Bedrooms" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="bathrooms">Bathrooms</label>
                <input type="number" id="bathrooms" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} min="0" step="0.5"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Bathrooms" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="area">Area (sq ft)</label>
                <input type="number" id="area" name="area" value={formData.area} onChange={handleInputChange} min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Area" />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="garageSpaces">Garage Spaces</label>
                <input type="number" id="garageSpaces" name="garageSpaces" value={formData.garageSpaces} onChange={handleInputChange} min="0"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Garage spaces" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(formData.amenities).map(([key, checked]) => (
                <div key={key} className="flex items-center">
                  <input type="checkbox" id={key} name={key} checked={checked} onChange={handleCheckboxChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <label htmlFor={key} className="ml-2 text-gray-700 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Property Images</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} multiple accept="image/*" className="hidden" />
              <i className="fas fa-cloud-upload-alt text-5xl text-gray-400 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Drag & Drop or Click to Upload</h3>
              <p className="text-gray-500 mb-4">Upload high quality images (max 10 files)</p>
              {isUploadingImages && <p className="text-sm text-blue-700 mb-2">Uploading images...</p>}
              <button type="button" className="bg-blue-800 text-white px-6 py-2 font-semibold hover:bg-blue-900 transition-colors rounded-md"
                onClick={() => fileInputRef.current?.click()} disabled={isUploadingImages}>
                Browse Files
              </button>
            </div>

            {uploadedImages.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Uploaded Images</h3>
                <p className="text-gray-500 mb-3">Select an image to set as featured (main) image</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className={`relative rounded-lg overflow-hidden border-2 ${featuredImageIndex === index ? 'border-blue-600' : 'border-transparent'}`}>
                      <Image src={image.url} alt={`Property image ${index + 1}`} width={300} height={200} className="w-full h-32 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-end">
                          <button type="button" onClick={() => removeImage(index)}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-100 cursor-pointer">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                        <button type="button" onClick={() => setAsFeatured(index)}
                          className={`w-full py-1 text-xs font-semibold rounded ${featuredImageIndex === index ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 hover:bg-gray-100'} cursor-pointer`}>
                          {featuredImageIndex === index ? 'Featured' : 'Set as Featured'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Media & Documents */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Media & Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Video Upload */}
              <div>
                <label className="block text-gray-700 mb-2">Property Video</label>
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoUpload}
                  accept="video/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={isUploadingVideo}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
                >
                  <i className="fas fa-video text-3xl text-gray-400 mb-2"></i>
                  <span className="text-sm text-gray-600">
                    {isUploadingVideo ? 'Uploading...' : formData.videoUrl ? 'Change Video' : 'Upload Video'}
                  </span>
                </button>
                {formData.videoUrl && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-xs text-green-700 truncate">Video uploaded</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, videoUrl: '' })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Brochure Upload */}
              <div>
                <label className="block text-gray-700 mb-2">Property Brochure</label>
                <input
                  type="file"
                  ref={brochureInputRef}
                  onChange={handleBrochureUpload}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => brochureInputRef.current?.click()}
                  disabled={isUploadingBrochure}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
                >
                  <i className="fas fa-file-pdf text-3xl text-gray-400 mb-2"></i>
                  <span className="text-sm text-gray-600">
                    {isUploadingBrochure ? 'Uploading...' : formData.brochureUrl ? 'Change Brochure' : 'Upload Brochure'}
                  </span>
                </button>
                {formData.brochureUrl && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-xs text-green-700 truncate">Brochure uploaded</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, brochureUrl: '' })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>

              {/* Floor Plan Upload */}
              <div>
                <label className="block text-gray-700 mb-2">Floor Plan</label>
                <input
                  type="file"
                  ref={floorPlanInputRef}
                  onChange={handleFloorPlanUpload}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => floorPlanInputRef.current?.click()}
                  disabled={isUploadingFloorPlan}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center"
                >
                  <i className="fas fa-drafting-compass text-3xl text-gray-400 mb-2"></i>
                  <span className="text-sm text-gray-600">
                    {isUploadingFloorPlan ? 'Uploading...' : formData.floorPlanUrl ? 'Change Floor Plan' : 'Upload Floor Plan'}
                  </span>
                </button>
                {formData.floorPlanUrl && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
                    <span className="text-xs text-green-700 truncate">Floor plan uploaded</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, floorPlanUrl: '' })}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => handleSubmit(true)}
              className="border border-blue-800 text-blue-800 px-6 py-3 font-semibold hover:bg-blue-50 transition-colors rounded-md cursor-pointer">
              {isEditMode ? 'Save as Draft' : 'Save Draft'}
            </button>
            <button type="button" onClick={() => handleSubmit(false)}
              className="bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors rounded-md cursor-pointer">
              {isEditMode ? 'Update & Publish' : 'Publish Property'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const AddPropertyPageWithSuspense = () => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>}>
    <AddPropertyPage />
  </Suspense>
);

export default AddPropertyPageWithSuspense;
