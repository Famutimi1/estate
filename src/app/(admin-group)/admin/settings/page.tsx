"use client";

import React, { useState, useEffect } from 'react';
import AdminAlert, { useAlerts } from '../components/AdminAlert';

const AdminSettingsPage: React.FC = () => {
  const { alerts, addAlert, dismissAlert } = useAlerts();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    currency: 'USD',
    propertiesPerPage: '12',
    enableRegistration: true,
    enableFavorites: true,
    maintenanceMode: false,
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    youtube: '',
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: '',
    metaDescription: '',
    googleAnalyticsId: '',
  });

  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSiteSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field: string) => {
    setSiteSettings((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocialLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoSettings((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (!res.ok) throw new Error('Failed to fetch settings');
        const data = await res.json();

        setSiteSettings({
          siteName: data.siteName || '',
          siteDescription: data.siteDescription || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          address: data.address || '',
          currency: data.currency || 'NGN',
          propertiesPerPage: String(data.propertiesPerPage || 12),
          enableRegistration: data.enableRegistration ?? true,
          enableFavorites: data.enableFavorites ?? true,
          maintenanceMode: data.maintenanceMode ?? false,
        });

        setSocialLinks({
          facebook: data.facebookUrl || '',
          twitter: data.twitterUrl || '',
          instagram: data.instagramUrl || '',
          linkedin: data.linkedinUrl || '',
          youtube: data.youtubeUrl || '',
        });

        setSeoSettings({
          metaTitle: data.metaTitle || '',
          metaDescription: data.metaDescription || '',
          googleAnalyticsId: data.googleAnalyticsId || '',
        });
      } catch (error) {
        console.error('Error fetching settings:', error);
        addAlert('error', 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [addAlert]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        siteName: siteSettings.siteName,
        siteDescription: siteSettings.siteDescription,
        contactEmail: siteSettings.contactEmail,
        contactPhone: siteSettings.contactPhone,
        address: siteSettings.address,
        currency: siteSettings.currency,
        propertiesPerPage: siteSettings.propertiesPerPage,
        enableRegistration: siteSettings.enableRegistration,
        enableFavorites: siteSettings.enableFavorites,
        maintenanceMode: siteSettings.maintenanceMode,
        facebookUrl: socialLinks.facebook,
        twitterUrl: socialLinks.twitter,
        instagramUrl: socialLinks.instagram,
        linkedinUrl: socialLinks.linkedin,
        youtubeUrl: socialLinks.youtube,
        metaTitle: seoSettings.metaTitle,
        metaDescription: seoSettings.metaDescription,
        googleAnalyticsId: seoSettings.googleAnalyticsId,
      };

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      addAlert('success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      addAlert('error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <AdminAlert alerts={alerts} onDismiss={dismissAlert} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-cog mr-2 text-gray-500"></i>General Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={siteSettings.siteName}
              onChange={handleSiteChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={siteSettings.contactEmail}
              onChange={handleSiteChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Contact Phone</label>
            <input
              type="text"
              name="contactPhone"
              value={siteSettings.contactPhone}
              onChange={handleSiteChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              name="address"
              value={siteSettings.address}
              onChange={handleSiteChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-medium mb-2">Site Description</label>
            <textarea
              name="siteDescription"
              value={siteSettings.siteDescription}
              onChange={handleSiteChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Currency</label>
            <select
              name="currency"
              value={siteSettings.currency}
              onChange={handleSiteChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Properties Per Page</label>
            <input
              type="number"
              name="propertiesPerPage"
              value={siteSettings.propertiesPerPage}
              onChange={handleSiteChange}
              min="1"
              max="100"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-toggle-on mr-2 text-gray-500"></i>Feature Toggles
        </h2>
        <div className="space-y-4">
          {[
            { key: 'enableRegistration', label: 'User Registration', desc: 'Allow new users to register on the website' },
            { key: 'enableFavorites', label: 'Favorites', desc: 'Allow users to save properties to their favorites' },
            { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Put the website in maintenance mode (only admins can access)' },
          ].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">{toggle.label}</p>
                <p className="text-sm text-gray-500">{toggle.desc}</p>
              </div>
              <button
                onClick={() => handleToggle(toggle.key)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  siteSettings[toggle.key as keyof typeof siteSettings] ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    siteSettings[toggle.key as keyof typeof siteSettings] ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-share-alt mr-2 text-gray-500"></i>Social Media Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'facebook', icon: 'fa-facebook-f', color: 'text-blue-600' },
            { name: 'twitter', icon: 'fa-twitter', color: 'text-sky-500' },
            { name: 'instagram', icon: 'fa-instagram', color: 'text-pink-500' },
            { name: 'linkedin', icon: 'fa-linkedin-in', color: 'text-blue-700' },
            { name: 'youtube', icon: 'fa-youtube', color: 'text-red-600' },
          ].map((social) => (
            <div key={social.name} className="relative">
              <label className="block text-gray-700 text-sm font-medium mb-2 capitalize">{social.name}</label>
              <div className="relative">
                <i className={`fab ${social.icon} absolute left-3 top-3.5 ${social.color}`}></i>
                <input
                  type="url"
                  name={social.name}
                  value={socialLinks[social.name as keyof typeof socialLinks]}
                  onChange={handleSocialChange}
                  placeholder={`https://${social.name}.com/...`}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          <i className="fas fa-search mr-2 text-gray-500"></i>SEO Settings
        </h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Meta Title</label>
            <input
              type="text"
              name="metaTitle"
              value={seoSettings.metaTitle}
              onChange={handleSeoChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Meta Description</label>
            <textarea
              name="metaDescription"
              value={seoSettings.metaDescription}
              onChange={handleSeoChange}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Google Analytics ID</label>
            <input
              type="text"
              name="googleAnalyticsId"
              value={seoSettings.googleAnalyticsId}
              onChange={handleSeoChange}
              placeholder="G-XXXXXXXXXX"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button (bottom) */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className={`fas ${saving ? 'fa-spinner fa-spin' : 'fa-save'} mr-2`}></i>
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
