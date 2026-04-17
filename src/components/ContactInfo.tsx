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
    const iconElement = showIcons && (
      <FontAwesomeIcon 
        icon={item.icon} 
        className={`${
          variant === 'list' ? 'mt-1 mr-3 text-blue-500' : 'mr-2'
        } text-xs`} 
      />
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
