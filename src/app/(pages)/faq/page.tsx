"use client"

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faHome, faSearch, faUser, faFileContract, faMoneyBillWave, faShieldAlt, faPhone, faEnvelope, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/hooks/useSettings';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon?: any;
}

const FAQPage: React.FC = () => {
  const { settings } = useSettings();
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    // General Questions
    {
      id: '1',
      question: 'What is Stan Grace Properties?',
      answer: 'Stan Grace Properties is Nigeria\'s premier real estate platform that connects buyers, sellers, renters, and real estate professionals. We provide a comprehensive platform for listing, searching, and transacting properties across Nigeria.',
      category: 'general',
      icon: faHome
    },
    {
      id: '2',
      question: 'How do I create an account?',
      answer: 'Creating an account is simple! Click on the "Register" button in the top navigation, fill in your details including name, email, and password, and verify your email address. Once verified, you can start using all our features.',
      category: 'general',
      icon: faUser
    },
    {
      id: '3',
      question: 'Is Stan Grace Properties free to use?',
      answer: 'Basic features like browsing properties and creating an account are free. However, we offer premium services such as featured property listings, advanced search filters, and professional consultations that may require payment.',
      category: 'general',
      icon: faMoneyBillWave
    },

    // Property Search
    {
      id: '4',
      question: 'How do I search for properties?',
      answer: 'Use our advanced search bar on the homepage and properties page. You can filter by location, property type, price range, number of bedrooms, bathrooms, and more. Save your searches to get notified when new properties match your criteria.',
      category: 'search',
      icon: faSearch
    },
    {
      id: '5',
      question: 'Can I save properties I am interested in?',
      answer: 'Yes! Once you create an account, you can save properties to your favorites by clicking the heart icon on any property listing. You can access your saved properties anytime from your profile dashboard.',
      category: 'search',
      icon: faHome
    },
    {
      id: '6',
      question: 'How often are property listings updated?',
      answer: 'Our property listings are updated in real-time. New properties are added immediately by agents and owners, and existing listings are updated as soon as changes are made. We recommend checking back frequently for new opportunities.',
      category: 'search',
      icon: faSearch
    },

    // Buying & Renting
    {
      id: '7',
      question: 'How do I contact a property owner or agent?',
      answer: 'Each property listing has contact information and a "Contact" button. You can send messages directly through our platform, call the provided phone number, or use the email contact form. All communications are tracked in your dashboard.',
      category: 'transactions',
      icon: faPhone
    },
    {
      id: '8',
      question: 'What should I look for when viewing a property?',
      answer: 'We recommend: 1) Verify the property matches the listing, 2) Check the neighborhood and amenities, 3) Inspect the property condition thoroughly, 4) Ask about utilities and additional costs, 5) Review all documents carefully, and 6) Consider future resale value.',
      category: 'transactions',
      icon: faHome
    },
    {
      id: '9',
      question: 'Can I negotiate prices?',
      answer: 'Yes, most property prices are negotiable. Use our messaging system to communicate with sellers or agents about price negotiations. Always be respectful and make reasonable offers based on market research.',
      category: 'transactions',
      icon: faMoneyBillWave
    },

    // Listing Properties
    {
      id: '10',
      question: 'How do I list my property on Stan Grace Properties?',
      answer: 'To list your property: 1) Create an account, 2) Click "Add Property" in your dashboard, 3) Fill in all property details including photos, price, and description, 4) Choose between free listing or premium features, 5) Submit for review. Your property will be live once approved.',
      category: 'listing',
      icon: faHome
    },
    {
      id: '11',
      question: 'What documents do I need to list my property?',
      answer: 'Required documents typically include: Property ownership documents, recent utility bills, property photographs, floor plans (if available), and valid identification. Having these ready will speed up the listing process.',
      category: 'listing',
      icon: faFileContract
    },
    {
      id: '12',
      question: 'How much does it cost to list a property?',
      answer: 'Basic property listings are free. Premium features like featured placement, multiple photos, video tours, and priority visibility have associated costs. Check our pricing page for detailed information on premium packages.',
      category: 'listing',
      icon: faMoneyBillWave
    },

    // Safety & Security
    {
      id: '13',
      question: 'How does Stan Grace Properties protect my personal information?',
      answer: 'We use industry-standard SSL encryption, secure servers, and strict data protection policies. Your personal information is never shared without your consent, and we comply with all applicable data protection regulations.',
      category: 'safety',
      icon: faShieldAlt
    },
    {
      id: '14',
      question: 'How can I avoid real estate scams?',
      answer: 'Red flags to watch for: 1) Requests for payment before viewing properties, 2) Pressure to make quick decisions, 3) Vague property descriptions, 4) Refusal to provide proper documentation, 5) Requests for personal financial information. Always meet in person and verify all documents.',
      category: 'safety',
      icon: faShieldAlt
    },
    {
      id: '15',
      question: 'What should I do if I encounter suspicious activity?',
      answer: 'Report any suspicious activity immediately through our platform report feature or contact our support team. We investigate all reports thoroughly and take appropriate action.',
      category: 'safety',
      icon: faShieldAlt
    },

    // Support
    {
      id: '16',
      question: 'How can I contact customer support?',
      answer: 'You can reach our support team via Email, Phone, or through the contact form on our website. Our support team is available Monday-Friday, 9 AM - 6 PM.',
      category: 'support',
      icon: faPhone
    },
    {
      id: '17',
      question: 'What if I forget my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and we will send you a password reset link. Follow the instructions in the email to create a new password. If you do not receive the email, check your spam folder.',
      category: 'support',
      icon: faUser
    },
    {
      id: '18',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account anytime from your profile settings. Note that deleting your account will remove all your data including saved properties, messages, and listing history. This action cannot be undone.',
      category: 'support',
      icon: faUser
    }
  ];

  const categories = [
    { id: 'all', name: 'All Questions', icon: faQuestionCircle },
    { id: 'general', name: 'General', icon: faHome },
    { id: 'search', name: 'Property Search', icon: faSearch },
    { id: 'transactions', name: 'Buying & Renting', icon: faMoneyBillWave },
    { id: 'listing', name: 'Listing Properties', icon: faFileContract },
    { id: 'safety', name: 'Safety & Security', icon: faShieldAlt },
    { id: 'support', name: 'Support', icon: faPhone }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faQuestionCircle} className="text-3xl text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Welcome to {settings?.siteName || 'Stan Grace Properties LTD'} FAQ and our real estate services.
          </p>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FontAwesomeIcon icon={category.icon} className="mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map(faq => (
            <div key={faq.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  {faq.icon && (
                    <FontAwesomeIcon 
                      icon={faq.icon} 
                      className="text-green-600 mr-4 text-lg" 
                    />
                  )}
                  <h3 className="text-lg font-semibold text-gray-800">{faq.question}</h3>
                </div>
                <FontAwesomeIcon 
                  icon={openItems.includes(faq.id) ? faChevronUp : faChevronDown}
                  className="text-gray-400"
                />
              </button>
              
              {openItems.includes(faq.id) && (
                <div className="px-6 pb-4">
                  <div className="pl-8">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-green-600 to-pink-600 text-white rounded-lg p-8 mt-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-green-100 mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href={`mailto:${settings?.contactEmail || 'support@stangracepropertiesltd.ng'}`}
                className="bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Email Support
              </a>
              <a 
                href={`tel:${settings?.contactPhone || '+2348000000000'}`}
                className="bg-pink-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-pink-700 transition-colors"
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                Call Us
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600">Properties Listed</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">500+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">24/7</div>
            <div className="text-gray-600">Support Available</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-pink-600 mb-2">18</div>
            <div className="text-gray-600">FAQ Questions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
