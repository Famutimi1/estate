"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getPropertyById, Property } from '@/lib/services/properties';
import { 
    faArrowLeft, 
    faChevronRight, 
    faMapMarkerAlt, 
    faBed, 
    faBath, 
    faRulerCombined, 
    faCar, 
    faCheck,
    faFilePdf,
    faFileAlt,
    faHome,
    faCheckCircle,
    faTree,
    faPlay,
    faVrCardboard,
    faGraduationCap,
    faUtensils,
    faPlaneDeparture,
    faHeartbeat,
    faPhoneAlt,
    faEnvelope,
    faStar
} from '@fortawesome/free-solid-svg-icons';

const PropertyDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'features' | 'video' | 'map'>('overview');
    const [showContactForm, setShowContactForm] = useState(false);
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchProperty = async () => {
            if (!params.slug) return;
            
            try {
                setLoading(true);
                const propertyData = await getPropertyById(params.slug as string);
                
                if (!propertyData) {
                    setError('Property not found');
                    return;
                }
                
                setProperty(propertyData);
                setError(null);
            } catch (err) {
                console.error('Error fetching property:', err);
                setError('Failed to load property details');
            } finally {
                setLoading(false);
            }
        };
        
        fetchProperty();
    }, [params.slug]);
    
    const onBack = () => {
        router.push('/');
    };
    
    if (loading) {
        return (
            <div className="container max-w-screen px-6 py-8">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }
    
    if (error || !property) {
        return (
            <div className="container max-w-screen px-6 py-8">
                <div className="flex flex-col justify-center items-center h-96">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">{error || 'Property not found'}</h2>
                    <button 
                        onClick={onBack}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="container bg-[#f9fafc] max-w-screen px-6 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-600 mb-8">
                <button onClick={onBack} className="hover:text-green-500 cursor-pointer">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Home
                </button>
                <FontAwesomeIcon icon={faChevronRight} className="mx-2 text-xs" />
                <span>Property Detail</span>
            </div>
            {/* Property Header */}
            <div className="flex flex-wrap justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">{property.title}</h1>
                    <p className="text-gray-600 flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-500" />
                        {property.address}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-green-500 mb-2">#{property.price.toLocaleString()}</div>
                    <div className="text-gray-600">#{Math.round(property.price / property.area).toLocaleString()} / {property.area_unit}</div>
                </div>
            </div>
            {/* Property Images */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="col-span-2 row-span-2">
                    <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
                {/* Additional property images would be displayed here if available */}
                {/* For now, we'll use the main image in all slots */}
                <div>
                    <img
                        src={property.image_url}
                        alt={`${property.title} - View 1`}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
                <div>
                    <img
                        src={property.image_url}
                        alt={`${property.title} - View 2`}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
                <div>
                    <img
                        src={property.image_url}
                        alt={`${property.title} - View 3`}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
                <div>
                    <img
                        src={property.image_url}
                        alt={`${property.title} - View 4`}
                        className="w-full h-full object-cover rounded-sm"
                    />
                </div>
            </div>
            {/* Property Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                {/* ['overview', 'details', 'features', 'video', 'map'] */}
                {['overview','map'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`px-6 py-3 font-semibold capitalize whitespace-nowrap !rounded-button cursor-pointer ${activeTab === tab
                                ? 'text-green-500 border-b-2 border-green-500'
                                : 'text-gray-600 hover:text-green-500'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* Main Content */}
            <div className="grid grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="col-span-2">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Overview</h2>
                            <p className="text-gray-600 mb-6">
                                {property.description}
                            </p>
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faBed} className="text-2xl text-green-500 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Bedrooms</div>
                                        <div className="text-xl font-semibold">{property.bedrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faBath} className="text-2xl text-green-500 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Bathrooms</div>
                                        <div className="text-xl font-semibold">{property.bathrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faRulerCombined} className="text-2xl text-green-500 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Area</div>
                                        <div className="text-xl font-semibold">{property.area.toLocaleString()} {property.area_unit}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCar} className="text-2xl text-green-500 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Garage</div>
                                        <div className="text-xl font-semibold">{property.garage || 0} Cars</div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Features</h3>
                            <ul className="grid grid-cols-2 gap-4 text-gray-600">
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Infinity Pool
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Smart Home System
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Wine Cellar
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Home Theater
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Gym
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Spa Bathroom
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Outdoor Kitchen
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                    Private Beach Access
                                </li>
                            </ul>
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Property Description</h3>
                                <p className="text-gray-600 mb-4">
                                    Welcome to this exceptional lagoon-front villa where luxury meets sophisticated Lagos living.
                                    This architectural masterpiece is designed to maximize the stunning Lagoon views while providing an
                                    unparalleled living experience.
                                </p>
                                <p className="text-gray-600 mb-4">
                                    The main level features an expansive open concept living area with designer finishes, a gourmet
                                    kitchen with top-of-the-line appliances, and seamless indoor-outdoor living spaces. The primary
                                    suite is a true sanctuary with a private terrace, walk-in closet, and a spa-inspired bathroom.
                                </p>
                                <p className="text-gray-600">
                                    Outside, the infinity pool appears to merge with the Lagos Lagoon horizon, while the landscaped grounds
                                    offer multiple entertaining areas. Additional amenities include a home automation system, wine cellar,
                                    home theater, and a state-of-the-art fitness center. This rare offering represents the pinnacle of
                                    luxury real estate in this exclusive waterfront community of Banana Island.
                                </p>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Documents</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <a href="#" className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                                    <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl mr-3" />
                                    <div>
                                        <div className="font-medium">Property Brochure</div>
                                        <div className="text-sm text-gray-500">PDF (2.5 MB)</div>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 text-2xl mr-3" />
                                    <div>
                                        <div className="font-medium">Floor Plans</div>
                                        <div className="text-sm text-gray-500">PDF (1.8 MB)</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}
                    {/* {activeTab === 'details' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Details</h2>
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Property ID:</span>
                                            <span className="font-medium">MV-38291</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Property Type:</span>
                                            <span className="font-medium">Villa</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Property Status:</span>
                                            <span className="font-medium">For Sale</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Property Price:</span>
                                            <span className="font-medium">$2,850,000</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Area:</span>
                                            <span className="font-medium">3,850 sq ft</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Bedrooms:</span>
                                            <span className="font-medium">5</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Bathrooms:</span>
                                            <span className="font-medium">4.5</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Garage:</span>
                                            <span className="font-medium">2 Cars</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Details</h3>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Year Built:</span>
                                            <span className="font-medium">2021</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Cooling:</span>
                                            <span className="font-medium">Central A/C</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Heating:</span>
                                            <span className="font-medium">Forced Air</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Lot Size:</span>
                                            <span className="font-medium">0.75 Acres</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Basement:</span>
                                            <span className="font-medium">Finished</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Exterior:</span>
                                            <span className="font-medium">Stucco, Glass</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Roof:</span>
                                            <span className="font-medium">Flat</span>
                                        </li>
                                        <li className="flex justify-between">
                                            <span className="text-gray-600">Structure Type:</span>
                                            <span className="font-medium">Concrete</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Property Documents</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <a href="#" className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                                    <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl mr-3" />
                                    <div>
                                        <div className="font-medium">Property Brochure</div>
                                        <div className="text-sm text-gray-500">PDF (2.5 MB)</div>
                                    </div>
                                </a>
                                <a href="#" className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer">
                                    <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 text-2xl mr-3" />
                                    <div>
                                        <div className="font-medium">Floor Plans</div>
                                        <div className="text-sm text-gray-500">PDF (1.8 MB)</div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}
                    {activeTab === 'features' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <i className="fas fa-home text-green-500 mr-2"></i>
                                        Interior Features
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Open floor plan with floor-to-ceiling windows</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Gourmet kitchen with marble countertops and high-end appliances</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Custom cabinetry and designer fixtures throughout</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Primary suite with private terrace and ocean views</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Spa-inspired bathrooms with freestanding tubs</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Home theater with premium sound system</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Wine cellar with temperature control</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>State-of-the-art fitness center</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                        <i className="fas fa-tree text-green-500 mr-2"></i>
                                        Exterior Features
                                    </h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Infinity pool overlooking the ocean</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Professionally landscaped grounds</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Multiple outdoor entertaining areas</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Outdoor kitchen with premium grill</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Private beach access</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Covered terrace with lounge area</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>2-car garage with electric vehicle charging</span>
                                        </li>
                                        <li className="flex items-start">
                                            <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                                            <span>Gated entrance with security system</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <i className="fas fa-map-marker-alt text-green-500 mr-2"></i>
                                    Community Features
                                </h3>
                                <ul className="grid grid-cols-2 gap-3">
                                    <li className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span>24/7 Security</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span>Community Clubhouse</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span>Tennis Courts</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span>Marina Access</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span>Golf Course Nearby</span>
                                    </li>
                                    <li className="flex items-center">
                                        <i className="fas fa-check-circle text-green-500 mr-2"></i>
                                        <span>Concierge Services</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                    {activeTab === 'video' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Video Tour</h2>
                            <div className="aspect-w-16 aspect-h-9 mb-6">
                                <div className="w-full h-0 pb-[56.25%] relative bg-gray-200 rounded-sm">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-green-500 bg-opacity-80 flex items-center justify-center mx-auto mb-4 cursor-pointer">
                                                <FontAwesomeIcon icon={faPlay} className="text-white text-2xl" />
                                            </div>
                                            <p className="text-gray-600">Click to play property video tour</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Virtual Reality Tour</h3>
                            <p className="text-gray-600 mb-6">
                                Experience this stunning property from the comfort of your current location with our immersive
                                virtual reality tour. Navigate through each room and explore every detail as if you were there in person.
                            </p>
                            <button className="bg-green-500 text-white px-6 py-3 font-semibold hover:bg-green-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                                <FontAwesomeIcon icon={faVrCardboard} className="mr-2" />
                                Launch VR Tour
                            </button>
                        </div>
                    )} */}
                    {activeTab === 'map' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Location</h2>
                            <div className="w-full h-[400px] bg-gray-200 rounded-sm mb-6">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <i className="fas fa-map-marker-alt text-4xl text-green-500 mb-4"></i>
                                        <p className="text-gray-600">Interactive map loading...</p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Neighborhood Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                                        <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Education</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>Corona Schools Ikoyi (0.8 miles)</li>
                                            <li>British International School (1.2 miles)</li>
                                            <li>Atlantic Hall Secondary School (2.5 miles)</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4 flex-shrink-0">
                                        <FontAwesomeIcon icon={faUtensils} className="text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Dining & Shopping</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>The Palms Shopping Mall (1.5 miles)</li>
                                            <li>Victoria Island Restaurants (0.5 miles)</li>
                                            <li>Lekki Market (0.7 miles)</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-4 flex-shrink-0">
                                        <FontAwesomeIcon icon={faPlaneDeparture} className="text-purple-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Transportation</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>Murtala Muhammed International Airport (18 miles)</li>
                                            <li>Ikoyi BRT Station (0.9 miles)</li>
                                            <li>Five Cowries Creek Terminal (0.3 miles)</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 flex-shrink-0">
                                        <FontAwesomeIcon icon={faHeartbeat} className="text-red-500" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-1">Health & Recreation</h4>
                                        <ul className="text-gray-600 space-y-1">
                                            <li>Lagoon Hospital (1.1 miles)</li>
                                            <li>Ikoyi Club 1938 (0.4 miles)</li>
                                            <li>HealthPlus Fitness Center (0.6 miles)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                {/* Right Sidebar */}
                <div>
                    <div className="bg-white p-6 rounded-sm shadow-md mb-6">
                        <div className="flex items-center mb-6">
                            <img
                                src="https://readdy.ai/api/search-image?query=Professional%20real%20estate%20agent%20headshot%2C%20confident%20smile%2C%20business%20attire%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20portrait%20photography%2C%20realtor%20profile%20picture&width=100&height=100&seq=13&orientation=squarish"
                                alt="Agent"
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h3 className="font-bold text-gray-800">Sarah Johnson</h3>
                                <p className="text-gray-600">Luxury Property Specialist</p>
                                <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i key={star} className="fas fa-star text-yellow-400 text-xs"></i>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-1">(42 reviews)</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowContactForm(!showContactForm)}
                            className="w-full bg-green-500 text-white py-3 font-semibold mb-4 hover:bg-green-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Contact Agent
                        </button>
                        <div className="flex justify-between">
                            <button className="flex-1 mr-2 border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                                Call
                            </button>
                            <button className="flex-1 ml-2 border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                Email
                            </button>
                        </div>
                    </div>
                    {showContactForm && (
                        <div className="bg-white p-6 rounded-sm shadow-md mb-6">
                            <h3 className="font-bold text-gray-800 mb-4">Contact Form</h3>
                            <form>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        placeholder="Your Phone"
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <textarea
                                        placeholder="Your Message"
                                        rows={4}
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center text-gray-600 text-sm">
                                        <input type="checkbox" className="mr-2" />
                                        I agree to the privacy policy
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-green-500 text-white py-3 font-semibold hover:bg-green-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-sm shadow-md mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Schedule a Viewing</h3>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Preferred Date</label>
                            <input
                                type="date"
                                className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Preferred Time</label>
                            <select className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm appearance-none">
                                <option>Morning (9AM - 12PM)</option>
                                <option>Afternoon (12PM - 4PM)</option>
                                <option>Evening (4PM - 7PM)</option>
                            </select>
                        </div>
                        <button className="w-full bg-green-500 text-white py-3 font-semibold hover:bg-green-600 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                            Request Viewing
                        </button>
                    </div>
                    {/* <div className="bg-white p-6 rounded-sm shadow-md">
                        <h3 className="font-bold text-gray-800 mb-4">Mortgage Calculator</h3>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Purchase Price</label>
                            <input
                                type="text"
                                value="$2,850,000"
                                className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Down Payment (%)</label>
                            <input
                                type="text"
                                value="20%"
                                className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Loan Term (Years)</label>
                            <select className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm appearance-none">
                                <option>30 Years</option>
                                <option>20 Years</option>
                                <option>15 Years</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Interest Rate (%)</label>
                            <input
                                type="text"
                                value="3.25%"
                                className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-green-500 text-sm"
                            />
                        </div>
                        <div className="p-4 bg-gray-50 rounded-sm mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Monthly Payment:</span>
                                <span className="font-bold">$9,945</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Loan Amount:</span>
                                <span className="font-bold">$2,280,000</span>
                            </div>
                        </div>
                        <button className="w-full border border-green-500 text-green-500 py-3 font-semibold hover:bg-green-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                            Get Pre-Approved
                        </button>
                    </div> */}
                </div>
            </div>
            <div className="mt-12 bg-white p-6 rounded-sm shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Properties You May Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer">
                            <div className="relative">
                                <img
                                    src={`https://readdy.ai/api/search-image?query=Luxury%20waterfront%20property%20with%20modern%20architecture%2C%20floor%20to%20ceiling%20windows%2C%20infinity%20pool%2C%20ocean%20view%2C%20sunset%20lighting%2C%20high-end%20real%20estate%20photography%2C%20exclusive%20beachfront%20residence&width=400&height=250&seq=${item + 20}&orientation=landscape`}
                                    alt={`Similar Property ${item}`}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 text-xs font-semibold">
                                    FOR SALE
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-800 mb-1">Luxury Oceanfront Villa</h3>
                                <p className="text-gray-600 text-sm mb-2">
                                    <i className="fas fa-map-marker-alt mr-1 text-green-500"></i>
                                    Ikoyi, Lagos
                                </p>
                                <div className="font-bold text-green-500 mb-2">${(2500000 + item * 150000).toLocaleString()}</div>
                                <div className="flex justify-between text-xs text-gray-600">
                                    <span><i className="fas fa-bed mr-1"></i> 4-5 Beds</span>
                                    <span><i className="fas fa-bath mr-1"></i> 4 Baths</span>
                                    <span><i className="fas fa-ruler-combined mr-1"></i> 3,500+ sqft</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


export default PropertyDetail;