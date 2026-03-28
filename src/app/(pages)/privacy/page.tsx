"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt, faLock, faUserShield, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/useSettings';

const PrivacyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faShieldAlt} className="text-3xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-600 mb-4">
            At {settings?.siteName || 'Stan Grace Properties LTD'}, we are committed to protecting your privacy and 
            ensuring the security of your personal information. This Privacy Policy explains how we 
            collect, use, and protect your information when you use our real estate platform.
          </p>
          <p className="text-gray-600">
            By using {settings?.siteName || 'Stan Grace Properties LTD'}, you agree to the collection and use of 
            information in accordance with this policy.
          </p>
        </div>

        {/* Information We Collect */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faUserShield} className="mr-2 text-blue-600" />
              Personal Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Name and contact details (email, phone number)</li>
              <li>Account credentials (username, password)</li>
              <li>Profile information and preferences</li>
              <li>Property ownership and rental history</li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faDatabase} className="mr-2 text-blue-600" />
              Usage Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Pages visited and time spent on our platform</li>
              <li>Property searches and filters used</li>
              <li>IP address and device information</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faLock} className="mr-2 text-blue-600" />
              Property Information
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Property details you list or inquire about</li>
              <li>Communication with agents and other users</li>
              <li>Saved properties and search preferences</li>
              <li>Schedule viewing requests and contact history</li>
            </ul>
          </div>
        </div>

        {/* How We Use Your Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-3">
            <li>To provide and maintain our real estate platform services</li>
            <li>To connect you with properties that match your preferences</li>
            <li>To facilitate communication between buyers, sellers, and agents</li>
            <li>To improve our services and user experience</li>
            <li>To send important updates and notifications</li>
            <li>To ensure platform security and prevent fraud</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>

        {/* Data Protection */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Protection</h2>
          <p className="text-gray-600 mb-4">
            We implement appropriate security measures to protect your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>SSL encryption for all data transmissions</li>
            <li>Secure servers with restricted access</li>
            <li>Regular security audits and updates</li>
            <li>Employee training on data protection</li>
            <li>Compliance with data protection regulations</li>
          </ul>
        </div>

        {/* Third-Party Sharing */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Third-Party Sharing</h2>
          <p className="text-gray-600 mb-4">
            We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>With your explicit consent</li>
            <li>With real estate agents and property owners for legitimate business purposes</li>
            <li>With service providers who assist in operating our platform</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or merger</li>
          </ul>
        </div>

        {/* Your Rights */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
          <p className="text-gray-600 mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Access to your personal information</li>
            <li>Correction of inaccurate information</li>
            <li>Deletion of your account and data</li>
            <li>Restriction of processing</li>
            <li>Data portability</li>
            <li>Objection to processing</li>
          </ul>
        </div>

        {/* Cookies */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookies</h2>
          <p className="text-gray-600 mb-4">
            We use cookies and similar technologies to enhance your experience:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Essential cookies for platform functionality</li>
            <li>Performance cookies to improve our services</li>
            <li>Analytics cookies to understand user behavior</li>
            <li>Advertising cookies for personalized content</li>
          </ul>
          <p className="text-gray-600 mt-4">
            You can control cookies through your browser settings.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about this Privacy Policy or how we handle your data, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>Email:</strong> {settings?.contactEmail || 'privacy@myhome.ng'}
              </div>
              <div>
                <strong>Phone:</strong> {settings?.contactPhone || '+234 800 000 0000'}
              </div>
              <div>
                <strong>Address:</strong> {settings?.address || 'Victoria Island, Lagos, Nigeria'}
              </div>
              <div>
                <strong>Website:</strong> {typeof window !== 'undefined' ? window.location.origin : 'www.myhome.ng'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
