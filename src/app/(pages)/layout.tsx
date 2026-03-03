"use client"

import FontAwesomeConfig from "@/components/FontAwesomeConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { 
  faPhoneAlt, 
  faMapMarkerAlt, 
  faEnvelope, 
  faCommentAlt, 
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faYoutube, 
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons';


import '@fortawesome/fontawesome-svg-core/styles.css';
// import { config } from '@fortawesome/fontawesome-svg-core';
// config.autoAddCss = false; // Tell Font Awesome to skip adding the CSS automatically since it's being imported.

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const { user: currentUser } = useAuth();
  const displayName = currentUser?.name?.split(' ')[0] || 'User';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <>
      <FontAwesomeConfig />
      {/* Top Bar */}
        <div className=" hidden bg-blue-900 text-white py-2 px-4 md:px-6 md:flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0 text-xs md:text-sm">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faPhoneAlt} className="mr-2 text-xs" />
              <span>+234 803 123 4567</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-xs" />
              <span>Victoria Island, Lagos</span>
            </div>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-xs" />
              <span>info@myhome.ng</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <a href="#" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-pink-600 flex items-center justify-center">
              <FontAwesomeIcon icon={faCommentAlt} className="text-white text-xs" />
            </a>
            <a href="#" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-blue-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faFacebookF} className="text-white text-xs" />
            </a>
            <a href="#" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-blue-400 flex items-center justify-center">
              <FontAwesomeIcon icon={faTwitter} className="text-white text-xs" />
            </a>
            <a href="#" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-pink-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faInstagram} className="text-white text-xs" />
            </a>
            <a href="#" className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-500 flex items-center justify-center">
              <FontAwesomeIcon icon={faYoutube} className="text-white text-xs" />
            </a>
          </div>
        </div>
        {/* Navigation */}
        <div className="relative flex flex-col md:flex-row justify-between items-center h-auto md:h-15 py-4 md:py-0 bg-white shadow-md">
          <div className="w-full md:w-auto px-4  md:px-8 bg-white flex items-center justify-between">
            <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity">
              <span className="text-gray-500">my</span>
              <span className="text-gray-700">HOME</span>
            </Link>
            <div className="flex md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-md"
                aria-label="Toggle mobile menu"
              >
                <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} className="text-gray-600 text-xl" />
              </button>
            </div>
          </div>
          <nav className="hidden md:flex flex-1">
            <Link href="/" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">Home</Link>
            <Link href="/about" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">About us</Link>
            <Link href="/properties" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">Listings</Link>
            <Link href="/news" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">News</Link>
            <Link href="/contact" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">Contact</Link>
          </nav>
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden w-full bg-white shadow-lg rounded-b-lg absolute top-full left-0 z-50">
              <nav className="flex flex-col py-2">
                <Link href="/" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">Home</Link>
                <Link href="/about" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">About us</Link>
                <Link href="/properties" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">Listings</Link>
                <Link href="/news" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">News</Link>
                <Link href="/contact" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">Contact</Link>
              </nav>
              {!currentUser ? (
                <div className="flex flex-col p-4 space-y-2">
                  <Link href="/auth/login" className="w-full py-2 px-4 bg-blue-700 text-black text-sm text-center rounded-sm hover:bg-pink-700 transition-colors duration-200">
                    LOGIN
                  </Link>
                  <Link href="/auth/register" className="w-full py-2 px-4 bg-pink-600 text-black text-sm text-center rounded-sm hover:bg-pink-700 transition-colors duration-200">
                    REGISTER
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col p-4 space-y-2">
                  <span className="text-gray-700 text-sm text-center">Hi, {displayName}</span>
                  <Link href="/auth/logout" className="w-full py-2 px-4 bg-red-600 text-white text-sm text-center rounded-sm hover:bg-red-700 transition-colors duration-200">
                    LOGOUT
                  </Link>
                </div>
              )}
            </div>
          )}
          <div className="hidden md:flex h-13">
            {!currentUser ? (
              <>
                <Link href="/auth/login" className="py-3 md:py-5 px-6 md:px-8 m-2 rounded-sm bg-blue-700 text-black text-sm flex items-center hover:bg-pink-700 transition-colors duration-200 whitespace-nowrap !rounded-button">
                  LOGIN
                </Link>
                <Link href="/auth/register" className="py-3 md:py-5 px-6 md:px-8 m-2 rounded-sm bg-pink-600 text-black text-sm flex items-center hover:bg-pink-700 transition-colors duration-200 whitespace-nowrap !rounded-button">
                  REGISTER
                </Link>
              </>
            ) : (
              <div className="relative flex items-center m-2" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <Image
                    src={currentUser.avatarUrl || 'https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520a%2520real%2520estate%2520agent%2520with%2520confident%2520smile%2520business%2520attire%2520neutral%2520background%2520high%2520quality%2520portrait%2520photography%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field%2520professional%2520appearance&width=40&height=40&seq=1&orientation=squarish'}
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="text-gray-700 text-sm">Hi, {displayName}</span>
                </button>
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-sm shadow-lg z-20">
                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <i className="fas fa-user mr-2 text-gray-600"></i>
                      Profile
                    </Link>
                    <Link href="/favorites" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <i className="fas fa-heart mr-2 text-gray-600"></i>
                      Favorites
                    </Link>
                    <Link href="/auth/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      <i className="fas fa-sign-out-alt mr-2 text-gray-600"></i>
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {children}
        <footer className="bg-blue-700 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-1 flex-col md:flex-row gap-8 justify-between  ">
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">About myHOME</h3>
                <p className="text-white mb-4">
                  myHOME is Nigeria&apos;s premier real estate platform, connecting buyers, sellers, and renters with the perfect properties across the country.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-white">
                    <FontAwesomeIcon icon={faFacebookF} className="text-xs" />
                  </a>
                  <a href="#" className="text-white hover:text-white">
                    <FontAwesomeIcon icon={faTwitter} className="text-xs" />
                  </a>
                  <a href="#" className="text-whit hover:text-white">
                    <FontAwesomeIcon icon={faInstagram} className="text-xs" />
                  </a>
                  <a href="#" className="text-white hover:text-white">
                    <FontAwesomeIcon icon={faLinkedinIn} className="text-xs" />
                  </a>
                </div>
              </div>
              <div className="flex flex-1 gap-20 md:gap-28 mr-0" >
                <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white hover:text-white">Home</a></li>
                  <li><a href="#" className="text-white hover:text-white">Properties</a></li>
                  <li><a href="#" className="text-white hover:text-white">Agents</a></li>
                  <li><a href="#" className="text-white hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-white hover:text-white">Contact Us</a></li>
                </ul>
                </div>
                <div>
                <h3 className="text-xl font-bold mb-4">Cities</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-white hover:text-white">Lagos</a></li>
                  <li><a href="#" className="text-white hover:text-white">Abuja</a></li>
                  <li><a href="#" className="text-white hover:text-white">Port Harcourt</a></li>
                  <li><a href="#" className="text-white hover:text-white">Ibadan</a></li>
                  <li><a href="#" className="text-white hover:text-white">Kano</a></li>
                </ul>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mt-1 mr-3 text-blue-500 text-xs" />
                    <span className="text-white">Victoria Island, Lagos, Nigeria</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faPhoneAlt} className="mt-1 mr-3 text-blue-500 text-xs" />
                    <span className="text-white">+234 803 123 4567</span>
                  </li>
                  <li className="flex items-start">
                    <FontAwesomeIcon icon={faEnvelope} className="mt-1 mr-3 text-blue-500 text-xs" />
                    <span className="text-white">info@myhome.ng</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-white">
              <p>&copy; 2023 myHOME. All rights reserved.</p>
            </div>
          </div>
        </footer>
    </>
  );
}
