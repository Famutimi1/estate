"use client"

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
// import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AdminSelect, { AdminSelectOption } from '@/app/(admin-group)/admin/components/AdminSelect';
import { fetchPropertyById, fetchProperties, Property } from '@/lib/api';

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
    faPlay,
    faVrCardboard,
    faGraduationCap,
    faUtensils,
    faPlaneDeparture,
    faHeartbeat,
    faPhoneAlt,
    faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

const PropertyDetail = () => {
    const params = useParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'video'>('overview');
    const [showContactForm, setShowContactForm] = useState(false);
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>('');
    const [viewerType, setViewerType] = useState('');
    const [preferredTime, setPreferredTime] = useState('');
    const [preferredDate, setPreferredDate] = useState('');
    const [isPreferredDateActive, setIsPreferredDateActive] = useState(false);

    // Schedule form state
    const [scheduleName, setScheduleName] = useState('');
    const [schedulePhone, setSchedulePhone] = useState('');
    const [scheduleEmail, setScheduleEmail] = useState('');
    const [scheduleMessage, setScheduleMessage] = useState('');
    const [scheduleSubmitting, setScheduleSubmitting] = useState(false);
    const [scheduleSuccess, setScheduleSuccess] = useState(false);
    const [scheduleError, setScheduleError] = useState('');

    // Contact form state
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [contactMessage, setContactMessage] = useState('');
    const [contactSubmitting, setContactSubmitting] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);
    const [contactError, setContactError] = useState('');

    const viewerTypeOptions: AdminSelectOption[] = [
        { value: 'buyer', label: 'I am a buyer' },
        { value: 'tenant', label: 'I am a tenant' },
        { value: 'agent', label: 'I am an agent' },
        { value: 'other', label: 'Others' },
    ];

    const preferredTimeOptions: AdminSelectOption[] = [
        { value: 'morning', label: 'Morning (9AM - 12PM)' },
        { value: 'afternoon', label: 'Afternoon (12PM - 4PM)' },
        { value: 'evening', label: 'Evening (4PM - 7PM)' },
    ];

    useEffect(() => {
        const fetchProperty = async () => {
            if (!params.slug) return;

            try {
                setLoading(true);
                const propertyData = await fetchPropertyById(params.slug as string);

                if (!propertyData) {
                    setError('Property not found');
                    return;
                }

                setProperty(propertyData);
                setError(null);

                // Set initial selected image to featured or first image
                const featuredIndex = propertyData.featuredImageIndex ?? propertyData.featured_image_index ?? 0;
                const allImages = propertyData.images || [];
                if (allImages.length > 0) {
                    setSelectedImage(allImages[featuredIndex] || allImages[0]);
                } else {
                    setSelectedImage(propertyData.image_url || propertyData.imageUrl || '');
                }

                // Fetch similar properties based on city and bedrooms
                const similarData = await fetchProperties({
                    location: propertyData.city,
                    bedrooms: propertyData.bedrooms,
                    limit: 3,
                });
                // Filter out the current property from similar properties
                const filteredSimilar = similarData.properties.filter(
                    (p) => p.id !== propertyData.id
                );
                setSimilarProperties(filteredSimilar.slice(0, 3));
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

    const handleScheduleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setScheduleSubmitting(true);
        setScheduleError('');
        setScheduleSuccess(false);

        try {
            const response = await fetch('/api/schedules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    preferredDate,
                    preferredTime,
                    name: scheduleName,
                    phone: schedulePhone,
                    email: scheduleEmail,
                    viewerType,
                    message: scheduleMessage,
                    propertyId: property?.id,
                    propertyTitle: property?.title,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to schedule viewing');
            }

            setScheduleSuccess(true);
            // Reset form
            setPreferredDate('');
            setPreferredTime('');
            setScheduleName('');
            setSchedulePhone('');
            setScheduleEmail('');
            setViewerType('');
            setScheduleMessage('');
        } catch (err: any) {
            setScheduleError(err.message || 'Failed to schedule viewing');
        } finally {
            setScheduleSubmitting(false);
        }
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactSubmitting(true);
        setContactError('');
        setContactSuccess(false);

        try {
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: contactName,
                    email: contactEmail,
                    phone: contactPhone,
                    message: contactMessage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            setContactSuccess(true);
            // Reset form
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

    if (loading) {
        return (
            <div className="container max-w-screen px-6 py-8">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-600"></div>
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
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
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
                <button onClick={onBack} className="hover:text-green-600 cursor-pointer">
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
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-green-600" />
                        {property.address}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-2">#{property.price.toLocaleString()}</div>
                    <div className="text-gray-600">#{Math.round(property.price / property.area).toLocaleString()} / {property.area_unit}</div>
                </div>
            </div>
            {/* Property Images */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {/* Main selected image */}
                <div className="col-span-2 row-span-2 overflow-hidden rounded-sm group">
                    <Image
                        src={selectedImage || (property.image_url || property.imageUrl || '').trimEnd()}
                        alt={property.title}
                        width={800}
                        height={600}
                        className="w-full h-full object-cover rounded-sm transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                    />
                </div>
                {/* Thumbnail images */}
                {property.images && property.images.length > 0 ? (
                    property.images.slice(0, 4).map((img, idx) => (
                        <div 
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={`overflow-hidden rounded-sm cursor-pointer transition-all duration-200 ${
                                selectedImage === img ? 'ring-2 ring-blue-600' : 'hover:opacity-80'
                            }`}
                        >
                            <Image
                                src={img.trimEnd()}
                                alt={`${property.title} - View ${idx + 1}`}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </div>
                    ))
                ) : (
                    // Fallback: show main image in thumbnails if no images array
                    Array(4).fill(null).map((_, idx) => (
                        <div key={idx} className="overflow-hidden rounded-sm opacity-50">
                            <Image
                                src={(property.image_url || property.imageUrl || '').trimEnd()}
                                alt={`${property.title} - View ${idx + 1}`}
                                width={400}
                                height={300}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </div>
                    ))
                )}
            </div>
            {/* Property Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
                {/* ['overview', 'details', 'features', 'video', 'map'] */}
                {['overview', 'video', 'map'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'overview' | 'map' | 'video')}
                        className={`px-6 py-3 font-semibold capitalize whitespace-nowrap !rounded-button cursor-pointer ${activeTab === tab
                            ? 'text-green-600 border-b-2 border-green-600'
                            : 'text-gray-600 hover:text-green-600'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            {/* Main Content */}
            <div className="flex flex-col md:flex-row  gap-4">
                {/* Left Content */}
                <div className="md:[width:60%]">
                    {activeTab === 'overview' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Overview</h2>
                            <p className="text-gray-600 mb-6">
                                {property.description}
                            </p>
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faBed} className="text-2xl text-green-600 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Bedrooms</div>
                                        <div className="text-xl font-semibold">{property.bedrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faBath} className="text-2xl text-pink-600 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Bathrooms</div>
                                        <div className="text-xl font-semibold">{property.bathrooms}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faRulerCombined} className="text-2xl text-green-600 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Area</div>
                                        <div className="text-xl font-semibold">{property.area.toLocaleString()} {property.area_unit}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faCar} className="text-2xl text-pink-600 mr-4" />
                                    <div>
                                        <div className="text-gray-600">Garage</div>
                                        <div className="text-xl font-semibold">{0} Cars</div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Additional Features</h3>
                            <ul className="grid grid-cols-2 gap-4 text-gray-600">
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Infinity Pool
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Smart Home System
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Wine Cellar
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Home Theater
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Gym
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Spa Bathroom
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                                    Outdoor Kitchen
                                </li>
                                <li className="flex items-center">
                                    <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
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
                                {property.brochureUrl ? (
                                    <a
                                        href={property.brochureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl mr-3" />
                                        <div>
                                            <div className="font-medium">Property Brochure</div>
                                            <div className="text-sm text-gray-500">Click to view/download</div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center p-4 border border-gray-200 rounded-sm opacity-50 cursor-not-allowed">
                                        <FontAwesomeIcon icon={faFilePdf} className="text-red-500 text-2xl mr-3" />
                                        <div>
                                            <div className="font-medium">Property Brochure</div>
                                            <div className="text-sm text-gray-500">Not available</div>
                                        </div>
                                    </div>
                                )}
                                {property.floorPlanUrl ? (
                                    <a
                                        href={property.floorPlanUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center p-4 border border-gray-200 rounded-sm hover:bg-gray-50 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faFileAlt} className="text-green-500 text-2xl mr-3" />
                                        <div>
                                            <div className="font-medium">Floor Plans</div>
                                            <div className="text-sm text-gray-500">Click to view/download</div>
                                        </div>
                                    </a>
                                ) : (
                                    <div className="flex items-center p-4 border border-gray-200 rounded-sm opacity-50 cursor-not-allowed">
                                        <FontAwesomeIcon icon={faFileAlt} className="text-green-500 text-2xl mr-3" />
                                        <div>
                                            <div className="font-medium">Floor Plans</div>
                                            <div className="text-sm text-gray-500">Not available</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    {activeTab === 'video' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Video Tour</h2>
                            {property.videoUrl ? (
                                <div className="aspect-w-16 aspect-h-9 mb-6">
                                    <video
                                        controls
                                        className="w-full rounded-sm"
                                        poster={(property.image_url || property.imageUrl || '').trimEnd()}
                                    >
                                        <source src={property.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            ) : (
                                <div className="aspect-w-16 aspect-h-9 mb-6">
                                    <div className="w-full h-0 pb-[56.25%] relative bg-gray-200 rounded-sm">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <FontAwesomeIcon icon={faPlay} className="text-gray-400 text-4xl mb-4" />
                                                <p className="text-gray-600">No video available for this property</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Virtual Reality Tour</h3>
                            <p className="text-gray-600 mb-6">
                                Experience this stunning property from the comfort of your current location with our immersive
                                virtual reality tour. Navigate through each room and explore every detail as if you were there in person.
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-3 font-semibold hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer">
                                <FontAwesomeIcon icon={faVrCardboard} className="mr-2" />
                                Launch VR Tour
                            </button>
                        </div>
                    )}
                    {activeTab === 'map' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Property Location</h2>
                            <div className="w-full h-[400px] bg-gray-200 rounded-sm mb-6">
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center">
                                        <i className="fas fa-map-marker-alt text-4xl text-blue-600 mb-4"></i>
                                        <p className="text-gray-600">Interactive map loading...</p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Neighborhood Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="flex items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                                        <FontAwesomeIcon icon={faGraduationCap} className="text-blue-600" />
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
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 flex-shrink-0">
                                        <FontAwesomeIcon icon={faUtensils} className="text-blue-600" />
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
                            <Image
                                src={property?.user?.avatarUrl || "https://readdy.ai/api/search-image?query=Professional%20real%20estate%20agent%20headshot%2C%20confident%20smile%2C%20business%20attire%2C%20studio%20lighting%2C%20clean%20background%2C%20high%20quality%20portrait%20photography%2C%20realtor%20profile%20picture&width=100&height=100&seq=13&orientation=squarish"}
                                width={100} height={100}
                                alt="Agent"
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            <div>
                                <h3 className="font-bold text-gray-800">{property?.user?.name || "Property Agent"}</h3>
                                <p className="text-gray-600 capitalize">{property?.user?.role === "agent" ? "Property Agent" : property?.user?.role || "Real Estate Professional"}</p>
                                {/* <div className="flex items-center mt-1">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <i key={star} className="fas fa-star text-yellow-400 text-xs"></i>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600 ml-1">(42 reviews)</span>
                                </div> */}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowContactForm(!showContactForm)}
                            className="w-full bg-blue-600 text-white py-3 font-semibold mb-4 hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer"
                        >
                            Contact Agent
                        </button>
                        <div className="flex justify-between">
                            <a 
                                href={`tel:${property?.user?.phone || "+2348012345678"}`}
                                className="flex-1 mr-2 border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer text-center"
                            >
                                <FontAwesomeIcon icon={faPhoneAlt} className="mr-2" />
                                Call
                            </a>
                            <a 
                                href={`mailto:${property?.user?.email || "contact@estate.com"}?subject=Inquiry about Property: ${property?.title}`}
                                className="flex-1 ml-2 border border-gray-300 py-3 font-semibold hover:bg-gray-50 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer text-center"
                            >
                                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                                Email
                            </a>
                        </div>
                    </div>
                    {showContactForm && (
                        <div className="bg-white p-6 rounded-sm shadow-md mb-6">
                            <h3 className="font-bold text-gray-800 mb-4">Contact Form</h3>
                            {contactSuccess && (
                                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-sm">
                                    Message sent successfully! We'll get back to you soon.
                                </div>
                            )}
                            {contactError && (
                                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-sm">
                                    {contactError}
                                </div>
                            )}
                            <form onSubmit={handleContactSubmit}>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={contactName}
                                        onChange={(e) => setContactName(e.target.value)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="tel"
                                        placeholder="Your Phone"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="mb-4">
                                    <textarea
                                        placeholder="Your Message"
                                        rows={4}
                                        value={contactMessage}
                                        onChange={(e) => setContactMessage(e.target.value)}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="flex items-center text-gray-600 text-sm">
                                        <input type="checkbox" className="mr-2" required />
                                        I agree to the privacy policy
                                    </label>
                                </div>
                                <button
                                    type="submit"
                                    disabled={contactSubmitting}
                                    className="w-full bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-pointer cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </div>
                    )}
                    <div className="bg-white p-6 rounded-sm shadow-md mb-6">
                        <h3 className="font-bold text-gray-800 mb-4">Schedule a Viewing</h3>
                        {scheduleSuccess && (
                            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-sm">
                                Viewing scheduled successfully! We'll contact you soon.
                            </div>
                        )}
                        {scheduleError && (
                            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-sm">
                                {scheduleError}
                            </div>
                        )}
                        <form onSubmit={handleScheduleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">Preferred Date</label>
                                <input
                                    type={preferredDate || isPreferredDateActive ? 'date' : 'text'}
                                    placeholder="Select a preferred date"
                                    value={preferredDate}
                                    onChange={(e) => setPreferredDate(e.target.value)}
                                    onFocus={() => setIsPreferredDateActive(true)}
                                    onBlur={(e) => {
                                        if (!e.target.value) {
                                            setIsPreferredDateActive(false);
                                        }
                                    }}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">Preferred Time</label>
                                <AdminSelect
                                    value={preferredTime}
                                    onChange={setPreferredTime}
                                    options={preferredTimeOptions}
                                    placeholder="Select a time slot"
                                    showBadge={false}
                                    buttonClassName="w-full p-3 text-left text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600"
                                    labelRenderer={(selected, placeholderText) => (
                                        <span className={`text-sm ${selected ? 'text-gray-700' : 'text-gray-500'}`}>
                                            {selected ? selected.label : placeholderText}
                                        </span>
                                    )}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    value={scheduleName}
                                    onChange={(e) => setScheduleName(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">Phone</label>
                                <input
                                    type="tel"
                                    placeholder="Your phone number"
                                    value={schedulePhone}
                                    onChange={(e) => setSchedulePhone(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">Email</label>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={scheduleEmail}
                                    onChange={(e) => setScheduleEmail(e.target.value)}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">I am</label>
                                <AdminSelect
                                    value={viewerType}
                                    onChange={setViewerType}
                                    options={viewerTypeOptions}
                                    placeholder="Select your role"
                                    showBadge={false}
                                    buttonClassName="w-full p-3 text-left text-sm border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-gray-700"
                                    labelRenderer={(selected, placeholderText) => (
                                        <span className={`text-sm ${selected ? 'text-gray-700' : 'text-gray-500'}`}>
                                            {selected ? selected.label : placeholderText}
                                        </span>
                                    )}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 text-sm mb-2">Message</label>
                                <textarea
                                    placeholder="Additional information or special requests"
                                    rows={4}
                                    value={scheduleMessage}
                                    onChange={(e) => setScheduleMessage(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-blue-600 text-sm placeholder:text-gray-500"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={scheduleSubmitting}
                                className="w-full bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700 transition-colors duration-200 !rounded-button whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {scheduleSubmitting ? 'Scheduling...' : 'Request Viewing'}
                            </button>
                        </form>
                    </div>
                    {/* <div className="bg-white p-6 rounded-sm shadow-md">
                        <h3 className="font-bold text-gray-800 mb-4">Mortgage Calculator</h3>
                        <div className="mb-4">
                            <label className="block text-gray-600 text-sm mb-2">Purchase Price</label>
                            <input
                                type="text"
                                value="₦2,850,000"
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
                                <span className="font-bold">₦9,945</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Loan Amount:</span>
                                <span className="font-bold">₦2,280,000</span>
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
                {similarProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {similarProperties.map((similarProp) => (
                            <div 
                                key={similarProp.id} 
                                onClick={() => router.push(`/properties/${similarProp.id}`)}
                                className="border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
                            >
                                <div className="relative">
                                    <Image
                                        src={(similarProp.image_url || similarProp.imageUrl || '').trimEnd()}
                                        width={400}
                                        height={250}
                                        alt={similarProp.title}
                                        className="w-full h-48 object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 text-xs font-semibold uppercase">
                                        {similarProp.propertyStatus || similarProp.property_status}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 mb-1">{similarProp.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1 text-blue-600" />
                                        {similarProp.city}, {similarProp.state}
                                    </p>
                                    <div className="font-bold text-blue-600 mb-2">#{similarProp.price.toLocaleString()}</div>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span><FontAwesomeIcon icon={faBed} className="mr-1" /> {similarProp.bedrooms} Beds</span>
                                        <span><FontAwesomeIcon icon={faBath} className="mr-1" /> {similarProp.bathrooms} Baths</span>
                                        <span><FontAwesomeIcon icon={faRulerCombined} className="mr-1" /> {similarProp.area.toLocaleString()} {similarProp.area_unit}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 text-center py-8">No similar properties found at the moment.</p>
                )}
            </div>
        </div>
    );
};
export default PropertyDetail;