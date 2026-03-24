"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebookF, 
  faTwitter, 
  faInstagram, 
  faYoutube, 
  faLinkedinIn 
} from '@fortawesome/free-brands-svg-icons';
import { useSettings } from '@/contexts/SettingsContext';

interface SocialMediaLinksProps {
  className?: string;
  showLabels?: boolean;
  variant?: 'icons' | 'buttons' | 'footer';
}

const SocialMediaLinks: React.FC<SocialMediaLinksProps> = ({ 
  className = '', 
  showLabels = false,
  variant = 'icons'
}) => {
  const { settings } = useSettings();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: faFacebookF,
      url: settings?.facebookUrl || 'https://facebook.com',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter',
      icon: faTwitter,
      url: settings?.twitterUrl || 'https://twitter.com',
      color: 'bg-blue-400',
      hoverColor: 'hover:bg-blue-500',
    },
    {
      name: 'Instagram',
      icon: faInstagram,
      url: settings?.instagramUrl || 'https://instagram.com',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
    },
    // {
    //   name: 'YouTube',
    //   icon: faYoutube,
    //   url: settings?.youtubeUrl || 'https://youtube.com',
    //   color: 'bg-red-500',
    //   hoverColor: 'hover:bg-red-600',
    // },
    {
      name: 'LinkedIn',
      icon: faLinkedinIn,
      url: settings?.linkedinUrl || 'https://linkedin.com',
      color: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800',
    },
  ];

  const getLinkClasses = (link: typeof socialLinks[0]) => {
    switch (variant) {
      case 'buttons':
        return `${link.color} ${link.hoverColor} text-white px-4 py-2 rounded-md transition-colors font-medium flex items-center`;
      case 'footer':
        return 'text-white hover:text-blue-200 transition-colors';
      case 'icons':
      default:
        return `w-6 h-6 md:w-7 md:h-7 rounded-full ${link.color} ${link.hoverColor} flex items-center justify-center transition-colors`;
    }
  };

  const getIconClasses = () => {
    switch (variant) {
      case 'buttons':
        return 'text-sm mr-2';
      case 'footer':
        return 'text-xs';
      case 'icons':
      default:
        return 'text-white text-xs';
    }
  };

  // Always show social media icons with fallback URLs
  // const filteredLinks = socialLinks.filter(link => link.url && link.url.trim() !== '');

  // if (filteredLinks.length === 0) {
  //   return null;
  // }

  return (
    <div className={`flex ${variant === 'buttons' ? 'flex-wrap gap-3' : 'space-x-2 md:space-x-3'} ${className}`}>
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={getLinkClasses(link)}
          aria-label={`Follow us on ${link.name}`}
        >
          <FontAwesomeIcon icon={link.icon} className={getIconClasses()} />
          {showLabels && <span>{link.name}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
