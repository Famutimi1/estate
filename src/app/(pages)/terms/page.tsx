"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileContract, faBalanceScale, faHandshake, faExclamationTriangle, faHome } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/useSettings';

const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faFileContract} className="text-3xl text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-600 mb-4">
            Welcome to {settings?.siteName || 'Stan Grace Properties LTD'}. These Terms of Service govern your 
            use of our real estate platform and services. By accessing or using {settings?.siteName || 'Stan Grace Properties LTD'}, 
            you agree to be bound by these terms.
          </p>
          <p className="text-gray-600">
            Please read these terms carefully before using our platform.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4">
            By accessing and using {settings?.siteName || 'Stan Grace Properties LTD'}, you:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Confirm that you are at least 18 years of age</li>
            <li>Have the legal capacity to enter into these terms</li>
            <li>Agree to comply with all applicable laws and regulations</li>
            <li>Accept responsibility for your account activities</li>
          </ul>
        </div>

        {/* Account Registration */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Registration</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Responsibilities</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Keep your login credentials secure</li>
              <li>Notify us immediately of unauthorized access</li>
              <li>Update your information when it changes</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Termination</h3>
            <p className="text-gray-600">
              We reserve the right to suspend or terminate accounts that violate these terms 
              or engage in fraudulent activities.
            </p>
          </div>
        </div>

        {/* Platform Services */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Platform Services</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faHome} className="mr-2 text-green-600" />
              Property Listings
            </h3>
            <p className="text-gray-600 mb-2">
              We provide a platform for listing, searching, and connecting real estate opportunities.
            </p>
            <p className="text-gray-600">
              We do not guarantee the accuracy, completeness, or reliability of property listings.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faHandshake} className="mr-2 text-pink-600" />
              User Connections
            </h3>
            <p className="text-gray-600">
              We facilitate connections between buyers, sellers, renters, and real estate professionals 
              but are not responsible for the outcome of these interactions.
            </p>
          </div>
        </div>

        {/* User Conduct */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Conduct</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Activities</h3>
            <p className="text-gray-600 mb-4">
              You agree not to engage in the following activities:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Posting false, misleading, or fraudulent information</li>
              <li>Impersonating another person or entity</li>
              <li>Violating any applicable laws or regulations</li>
              <li>Interfering with platform functionality</li>
              <li>Spamming or sending unsolicited communications</li>
              <li>Discriminating based on protected characteristics</li>
              <li>Engaging in predatory or unfair practices</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Standards</h3>
            <p className="text-gray-600">
              All content must be appropriate, legal, and respectful. We reserve the right 
              to remove content that violates these standards.
            </p>
          </div>
        </div>

        {/* Property Transactions */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Property Transactions</h2>
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <FontAwesomeIcon icon={faBalanceScale} className="mr-2 text-green-600" />
              Independent Transactions
            </h3>
            <p className="text-gray-600 mb-4">
              {settings?.siteName || 'Stan Grace Properties'} is a platform for connecting parties, not a party to real estate transactions.
            </p>
            <p className="text-gray-600">
              Users are responsible for conducting their own due diligence and seeking professional advice.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Warranties</h3>
            <p className="text-gray-600">
              We make no warranties about property listings, user information, or transaction outcomes.
            </p>
          </div>
        </div>

        {/* Fees and Payments */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Fees and Payments</h2>
          <p className="text-gray-600 mb-4">
            Some services on {settings?.siteName || 'Stan Grace Properties'} may require payment:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Premium property listings</li>
            <li>Featured placement and promotion</li>
            <li>Professional services and consultations</li>
            <li>Transaction processing fees</li>
          </ul>
          <p className="text-gray-600 mt-4">
            All fees are clearly disclosed before payment is required.
          </p>
        </div>

        {/* Intellectual Property */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Intellectual Property</h2>
          <p className="text-gray-600 mb-4">
            The {settings?.siteName || 'Stan Grace Properties'} platform and its content are protected by intellectual property laws.
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You retain ownership of content you post</li>
            <li>You grant us license to use your content for platform operations</li>
            <li>You may not use our content without permission</li>
            <li>Third-party content remains the property of its owners</li>
          </ul>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-start">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-600 mt-1 mr-3" />
              <div>
                <p className="text-gray-700 mb-2">
                  <strong>Important Notice:</strong>
                </p>
                <p className="text-gray-600">
                  {settings?.siteName || 'Stan Grace Properties'} shall not be liable for any direct, indirect, 
                  incidental, or consequential damages arising from your use of our platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Termination</h2>
          <p className="text-gray-600 mb-4">
            These terms remain in effect until terminated:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>You may terminate your account at any time</li>
            <li>We may suspend access for violations</li>
            <li>Termination does not affect prior obligations</li>
            <li>Certain provisions survive termination</li>
          </ul>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Governing Law</h2>
          <p className="text-gray-600">
            These terms are governed by the laws of Nigeria. Any disputes shall be 
            resolved through arbitration in Lagos, Nigeria.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
          <p className="text-gray-600">
            We may update these terms periodically. Changes will be effective immediately 
            upon posting. Your continued use of the platform constitutes acceptance of any changes.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you have questions about these Terms of Service, please contact us:
          </p>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <strong>Email:</strong> {settings?.contactEmail || 'legal@stangracepropertiesltd.ng'}
              </div>
              <div>
                <strong>Phone:</strong> {settings?.contactPhone || '+234 800 000 0000'}
              </div>
              <div>
                <strong>Address:</strong> {settings?.address || 'Victoria Island, Lagos, Nigeria'}
              </div>
              <div>
                <strong>Website:</strong> {typeof window !== 'undefined' ? window.location.origin : 'www.stangracepropertiesltd.ng'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
