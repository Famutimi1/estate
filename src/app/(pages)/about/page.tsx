"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faUsers, faAward, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/useSettings';

const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About {settings?.siteName || 'myHOME'}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {settings?.siteDescription || 'Your trusted real estate partner in Nigeria'}
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Founded with a vision to revolutionize the real estate experience in Nigeria, 
                {settings?.siteName || 'myHOME'} has been connecting people with their dream homes since 2020.
              </p>
              <p className="text-gray-600 mb-4">
                We understand that finding the perfect property is more than just a transaction—it's 
                about finding a place where memories are made, families grow, and futures are built.
              </p>
              <p className="text-gray-600">
                Our team of experienced professionals is dedicated to making your real estate journey 
                seamless, transparent, and rewarding.
              </p>
            </div>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-6xl text-gray-400" />
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide exceptional real estate services that make property buying, selling, and renting 
              a delightful experience for every Nigerian, leveraging technology and expertise to deliver 
              value and build lasting relationships.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To be Nigeria's most trusted and innovative real estate platform, transforming the way 
              people discover, evaluate, and acquire properties across the country.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Integrity</h3>
              <p className="text-gray-600">
                We operate with transparency and honesty in all our dealings.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer First</h3>
              <p className="text-gray-600">
                Your needs and satisfaction are at the heart of everything we do.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faAward} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in service, quality, and innovation.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Properties Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Expert Agents</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600">{settings?.address || 'Victoria Island, Lagos, Nigeria'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600">{settings?.contactPhone || '+234 800 000 0000'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600">{settings?.contactEmail || 'info@myhome.ng'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
