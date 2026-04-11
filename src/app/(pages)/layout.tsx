"use client"

import FontAwesomeConfig from "@/components/FontAwesomeConfig";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/contexts/SettingsContext";
import SocialMediaLinks from "@/components/SocialMediaLinks";
import ContactInfo from "@/components/ContactInfo";
import {
  faCommentAlt,
  faBars,
  faTimes,
  faHeart
} from '@fortawesome/free-solid-svg-icons';


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
  const [favoritesCount, setFavoritesCount] = useState(0);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const { user: currentUser, loading: authLoading } = useAuth();
  const { settings } = useSettings();
  const displayName = currentUser?.name?.split(' ')[0] || 'User';

  // Fetch favorites count
  useEffect(() => {
    if (currentUser?.id) {
      fetchFavoritesCount();
    }
  }, [currentUser]);

  const fetchFavoritesCount = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${currentUser?.id}`);
      const result = await response.json();
      if (result.success) {
        setFavoritesCount(result.favorites.length);
      }
    } catch (error) {
      console.error('Error fetching favorites count:', error);
    }
  };

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
      <div className=" hidden bg-green-900 text-white py-2 px-4 md:px-6 md:flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0 text-xs md:text-sm">
          <ContactInfo variant="inline" />
        </div>
        <div className="flex items-center space-x-2 md:space-x-3">
          <SocialMediaLinks variant="icons" />
        </div>
      </div>
      {/* Navigation */}
      <div className="relative flex flex-col md:flex-row justify-between items-center h-auto md:h-15 py-4 md:py-0 bg-white shadow-md">
        <div className="w-full md:w-auto px-4  md:px-8 bg-white flex items-center justify-between  overflow-hidden">
          <Link href="/" className="flex items-center space-x-2 text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity">
            <Image
              src="/company_logo/company_logo.png"
              alt="Company Logo"
              width={180}
              height={440}
              className="h-12 w-12 object-contain scale-200"
              // className="w-8 h-8 object-contain"
            />
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
          {/* <Link href="/news" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">News</Link> */}
          <Link href="/contact" className="py-1 px-4 md:px-6 bg-white text-gray-600 text-sm flex items-center hover:bg-gray-100 transition-colors duration-200">Contact</Link>
        </nav>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden w-full bg-white shadow-lg rounded-b-lg absolute top-full left-0 z-50">
            <nav className="flex flex-col py-2">
              <Link href="/" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">Home</Link>
              <Link href="/about" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">About us</Link>
              <Link href="/properties" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">Listings</Link>
              {/* <Link href="/news" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">News</Link> */}
              <Link href="/contact" className="px-4 py-2 text-gray-600 text-sm hover:bg-gray-100">Contact</Link>
            </nav>
            {authLoading ? (
              <div className="flex flex-col p-4 space-y-2">
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
              </div>
            ) : !currentUser ? (
              <div className="flex flex-col p-4 space-y-2">
                <Link href="/auth/login" className="w-full py-2 px-4 bg-green-700 text-white text-sm text-center rounded-sm hover:bg-green-800 transition-colors duration-200">
                  LOGIN
                </Link>
                <Link href="/auth/register" className="w-full py-2 px-4 bg-pink-600 text-white text-sm text-center rounded-sm hover:bg-pink-700 transition-colors duration-200">
                  REGISTER
                </Link>
              </div>
            ) : (
              <div className="flex flex-col p-4 space-y-3">
                {/* User Profile Section */}
                <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                  <Image
                    src={currentUser.avatar_url || 'https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520a%2520real%2520estate%2520agent%2520with%2520confident%2520smile%2520business%2520attire%2520neutral%2520background%2520high%2520quality%2520portrait%2520photography%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field%2520professional%2520appearance&width=40&height=40&seq=1&orientation=squarish'}
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-gray-800 font-medium text-sm">Hi, {displayName}</div>
                    <div className="text-gray-500 text-xs">
                      {currentUser.role === 'admin' ? 'Administrator' : currentUser.role === 'agent' ? 'Agent' : 'User'}
                    </div>
                  </div>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex flex-col space-y-1">
                  <Link href="/profile" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-user text-gray-500 w-4"></i>
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link href="/favorites" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <i className="fas fa-heart text-gray-500 w-4"></i>
                    <span className="text-sm">Favorites</span>
                    {favoritesCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {favoritesCount > 99 ? '99+' : favoritesCount}
                      </span>
                    )}
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                      <i className="fas fa-cog text-gray-500 w-4"></i>
                      <span className="text-sm">Admin Dashboard</span>
                    </Link>
                  )}
                </nav>
                
                {/* Logout Button */}
                <div className="pt-2 border-t border-gray-200">
                  <Link href="/auth/logout" className="w-full flex items-center justify-center space-x-2 py-3 px-4 !bg-red-500 !text-white text-sm font-medium rounded-lg hover:!bg-red-600 transition-colors duration-200 border-2 border-red-500">
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="hidden md:flex h-13">
          {authLoading ? (
            <div className="flex items-center space-x-2 mr-10">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : !currentUser ? (
            <>
              <Link href="/auth/login" className="py-3 md:py-5 px-6 md:px-8 m-2 rounded-sm bg-green-700 text-white text-sm flex items-center hover:bg-green-800 transition-colors duration-200 whitespace-nowrap !rounded-button">
                LOGIN
              </Link>
              <Link href="/auth/register" className="py-3 md:py-5 px-6 md:px-8 m-2 rounded-sm bg-pink-600 text-white text-sm flex items-center hover:bg-pink-700 transition-colors duration-200 whitespace-nowrap !rounded-button">
                REGISTER
              </Link>
            </>
          ) : (
            <>
              {/* Favorites Icon with Count */}
              <Link href="/favorites" className="relative flex items-center justify-center w-10 h-10 mt-2 mr-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 self-center">
                <FontAwesomeIcon 
                  icon={faHeart} 
                  className="text-gray-600 text-lg"
                />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </Link>
              
              {/* Profile Menu */}
              <div className="relative flex items-center mr-2 md:mr-10" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center space-x-1 md:space-x-2 cursor-pointer px-2 md:px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Image
                  src={currentUser.avatar_url || 'https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520a%2520real%2520estate%2520agent%2520with%2520confident%2520smile%2520business%2520attire%2520neutral%2520background%2520high%2520quality%2520portrait%2520photography%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field%2520professional%2520appearance&width=40&height=40&seq=1&orientation=squarish'}
                  alt="User"
                  width={40}
                  height={40}
                  className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                />
                <span className="text-gray-700 text-xs md:text-sm hidden sm:inline">Hi, {displayName}</span>
                <svg
                  className={`w-3 h-3 md:w-4 md:h-4 text-gray-600 transition-transform duration-200 ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 md:w-48 bg-white rounded-sm shadow-lg z-20">
                  <Link href="/profile" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 text-sm">
                    <i className="fas fa-user mr-2 text-gray-600"></i>
                    <span className="hidden sm:inline">Profile</span>
                    <span className="sm:hidden">Account</span>
                  </Link>
                  <Link href="/favorites" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 text-sm">
                    <i className="fas fa-heart mr-2 text-gray-600"></i>
                    <span className="hidden sm:inline">Favorites</span>
                    <span className="sm:hidden">Saved</span>
                  </Link>
                  {currentUser?.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 text-sm">
                      <i className="fas fa-cog mr-2 text-gray-600"></i>
                      <span className="hidden sm:inline">Admin</span>
                      <span className="sm:hidden">Admin</span>
                    </Link>
                  )}
                  <Link href="/auth/logout" className="block px-3 py-2 text-gray-800 hover:bg-gray-100 text-sm">
                    <i className="fas fa-sign-out-alt mr-2 text-gray-600"></i>
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Exit</span>
                  </Link>
                </div>
              )}
            </div>
            </>
          )}
        </div>
      </div>
      {children}
      <footer className="bg-green-700 text-white py-12">
        <div className="container mx-auto px-6">
            <div className="flex flex-1 flex-col md:flex-row gap-8 justify-between  ">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">About myHOME</h3>
              <p className="text-white mb-4">
                myHOME is Nigeria&apos;s premier real estate platform, connecting buyers, sellers, and renters with the perfect properties across the country.
              </p>
              <div className="flex space-x-4">
                <SocialMediaLinks variant="footer" />
              </div>
            </div>
            <div className="flex flex-1 gap-5 md:gap-10 mr-0">
              <div className="min-w-[150px]">
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link href="/" className="text-white hover:text-green-200">Home</Link></li>
                  <li><Link href="/properties" className="text-white hover:text-green-200">Properties</Link></li>
                  <li><Link href="/about" className="text-white hover:text-green-200">About Us</Link></li>
                  <li><Link href="/faq" className="text-white hover:text-green-200">FAQ</Link></li>
                  <li><Link href="/contact" className="text-white hover:text-green-200">Contact Us</Link></li>
                </ul>
              </div>
              {/* <div className="min-w-[150px]">
                <h3 className="text-xl font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-white hover:text-blue-200">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="text-white hover:text-blue-200">Terms of Service</Link></li>
                </ul>
              </div> */}
              <div className="min-w-[150px]">
                <h3 className="text-xl font-bold mb-4">Cities</h3>
                <ul className="space-y-2">
                  <li><a href={`/properties?location=${encodeURIComponent('Lagos')}`} className="text-white hover:text-green-200">Lagos</a></li>
                  <li><a href={`/properties?location=${encodeURIComponent('Ogun')}`} className="text-white hover:text-green-200">Ogun</a></li>
                  <li><a href={`/properties?location=${encodeURIComponent('Oyo')}`} className="text-white hover:text-green-200">Oyo</a></li>
                  <li><a href={`/properties?location=${encodeURIComponent('Abuja')}`} className="text-white hover:text-green-200">Abuja</a></li>
                </ul>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ContactInfo variant="list" />
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-white">
            <div className="flex justify-between items-center">
              <p>&copy; {new Date().getFullYear()} myHOME. All rights reserved.</p>
              <div className="flex space-x-4">
                <Link href="/privacy" className="text-white hover:text-green-200 text-sm">Privacy Policy</Link>
                <span className="text-white text-sm">•</span>
                <Link href="/terms" className="text-white hover:text-green-200 text-sm">Terms of Service</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
