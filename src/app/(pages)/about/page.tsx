"use client"

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding, faUsers, faAward, faCheckCircle, faChartLine, faShieldAlt, faHandshake, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/useSettings';
import ContactInfo from '@/components/ContactInfo';

const AboutPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            About Stan Grace Properties Ltd.
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Building Smart Property Investments for Visionary Buyers
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-4">
            We help individuals, families, and investors secure genuine and high-value landed properties 
            through trusted real estate solutions, strategic land banking, and seamless property acquisition processes.
          </p>
        </div>

        {/* Our Story */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-4">
                Stan Grace Properties Ltd. was founded with a clear mission: to solve the persistent challenges 
                of land fraud, insecure property transactions, and lack of access to affordable investment 
                opportunities in Nigeria's real estate sector.
              </p>
              <p className="text-gray-600 mb-4">
                What began as a vision to help people acquire land with confidence has grown into a trusted 
                real estate brand known for integrity, transparency, and results.
              </p>
              <p className="text-gray-600">
                Today, we proudly serve a wide range of clients—from first-time land buyers to seasoned 
                investors—delivering verified properties and investment opportunities that create long-term 
                value and financial security.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg h-64 flex items-center justify-center">
              <FontAwesomeIcon icon={faBuilding} className="text-6xl text-white" />
            </div>
          </div>
        </div>

        {/* Our Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              To provide secure, transparent, and profitable real estate solutions that empower individuals 
              and investors to build lasting wealth through property ownership.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600">
              To become one of Nigeria's most trusted and leading real estate companies, known for 
              transforming land acquisition into a safe, accessible, and wealth-building opportunity for all.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faHome} className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Land Sales & Acquisition</h3>
                <p className="text-gray-600">
                  Verified and strategically located lands with genuine documentation
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faChartLine} className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Land Banking Opportunities</h3>
                <p className="text-gray-600">
                  Investment in fast-developing areas for high future returns
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faShieldAlt} className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Property Documentation & Verification</h3>
                <p className="text-gray-600">
                  Secure and legally compliant transactions
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faUsers} className="text-xl text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Real Estate Investment Advisory</h3>
                <p className="text-gray-600">
                  Guidance for informed and profitable decisions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Core Values */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Integrity</h3>
              <p className="text-gray-600 text-sm">
                Honesty, transparency, and accountability
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faAward} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Excellence</h3>
              <p className="text-gray-600 text-sm">
                High-quality service and professionalism
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faUsers} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Commitment</h3>
              <p className="text-gray-600 text-sm">
                Clients come first
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faChartLine} className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600 text-sm">
                Continuous improvement and smarter solutions
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Stan Grace Properties Ltd.?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
              <span className="text-gray-700">Proven expertise in land sales and real estate investment</span>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
              <span className="text-gray-700">Verified properties with genuine documentation</span>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
              <span className="text-gray-700">Strategic locations with high appreciation potential</span>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
              <span className="text-gray-700">Customer-first approach</span>
            </div>
            <div className="flex items-center space-x-3">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-xl" />
              <span className="text-gray-700">Transparent processes with zero hidden risks</span>
            </div>
          </div>
        </div>

        {/* Our Impact */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Satisfied Clients Served</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Multiple</div>
              <div className="text-blue-100">Successful Land Transactions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">Key Locations</div>
              <div className="text-blue-100">Presence in Ogun State and Beyond</div>
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Meet the Team</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto">
            Our team consists of dedicated real estate professionals committed to delivering excellence 
            and ensuring smooth, secure, and rewarding transactions.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Let's Build Something Great Together</h2>
          <p className="text-xl text-blue-100 mb-6">
            Ready to secure your future through smart real estate investment?
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Contact Us Today
          </button>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faHome} className="text-xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Location</h3>
              <p className="text-gray-600">Abeokuta, Nigeria</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
              <p className="text-gray-600">info@stangraceproperties24.com</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faPhone} className="text-xl text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
              <p className="text-gray-600">+234 9075875787</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
