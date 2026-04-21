"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhoneAlt, 
  faMapMarkerAlt, 
  faEnvelope 
} from '@fortawesome/free-solid-svg-icons';
import { useSettings } from '@/contexts/SettingsContext';

interface ContactInfoProps {
  className?: string;
  variant?: 'inline' | 'list' | 'compact';
  showIcons?: boolean;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ 
  className = '', 
  variant = 'inline',
  showIcons = true
}) => {
  const { settings } = useSettings();

  const contactInfo = [
    {
      icon: faPhoneAlt,
      value: settings?.contactPhone || '+234 803 123 4567',
      label: 'Phone',
      href: `tel:${settings?.contactPhone || '+2348031234567'}`,
    },
    {
      icon: faMapMarkerAlt,
      value: settings?.address || 'Victoria Island, Lagos, Nigeria',
      label: 'Address',
      href: null,
    },
    {
      icon: faEnvelope,
      value: settings?.contactEmail || 'info@stangracepropertiesltd.ng',
      label: 'Email',
      href: `mailto:${settings?.contactEmail || 'info@stangracepropertiesltd.ng'}`,
    },
  ];

  const renderContactItem = (item: typeof contactInfo[0]) => {
    // Use a square with border and more visible background
    const iconBg = variant === 'list'
      ? 'bg-gradient-to-br from-sky-100 to-blue-200 text-blue-700 border-blue-300'
      : 'bg-gradient-to-br from-orange-100 to-amber-200 text-orange-700 border-orange-300';
    const iconSize = variant === 'list' ? 'w-9 h-9 text-lg' : 'w-9 h-9 text-lg';
    const iconMargin = 'mr-3';
    const iconElement = showIcons && (
      <span className={`flex items-center justify-center shrink-0 ${iconBg} ${iconSize} ${iconMargin} border-2 rounded-md shadow-sm`}>
        <FontAwesomeIcon 
          icon={item.icon} 
          className="" 
        />
      </span>
    );

    const content = (
      <span className={variant === 'list' ? 'text-white' : ''}>
        {item.value}
      </span>
    );

    if (item.href) {
      return (
        <a 
          href={item.href} 
          className={`flex items-center ${
            variant === 'list' ? 'items-start' : ''
          } ${
            variant === 'compact' ? 'text-xs' : ''
          } ${
            variant === 'list' ? 'text-white hover:text-blue-200' : ''
          } hover:opacity-80 transition-opacity`}
        >
          {iconElement}
          {content}
        </a>
      );
    }

    return (
      <div className={`flex items-center ${
        variant === 'list' ? 'items-start' : ''
      } ${variant === 'compact' ? 'text-xs' : ''}`}>
        {iconElement}
        {content}
      </div>
    );
  };

  const getContainerClasses = () => {
    switch (variant) {
      case 'list':
        return 'space-y-2';
      case 'compact':
        return 'flex flex-col space-y-1';
      case 'inline':
      default:
        return 'flex flex-col md:flex-row items-center md:space-x-6 space-y-2 md:space-y-0';
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {contactInfo.map((item, index) => (
        <div key={index}>
          {renderContactItem(item)}
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
