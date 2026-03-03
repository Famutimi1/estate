"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminSelect, { AdminSelectOption } from '../components/AdminSelect';
import AdminAlert, { useAlerts } from '../components/AdminAlert';
import ConfirmModal from '../components/ConfirmModal';

interface PropertyItem {
  id: string;
  title: string;
  price: number;
  propertyStatus: string;
  propertyType: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit?: string;
  imageUrl: string;
  images?: string[];
  featuredImageIndex?: number | null;
  createdAt: string;
  userId: string | null;
  user: { name: string; email: string } | null;
  description?: string;
  location?: string;
  garageSpaces?: number | null;
  amenities?: string[] | null;
}

interface PropertiesResponse {
  properties: PropertyItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminPropertiesPage: React.FC = () => {
  const [data, setData] = useState<PropertiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('');
  const [status, setStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewProperty, setPreviewProperty] = useState<PropertyItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<PropertyItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { alerts, addAlert, dismissAlert } = useAlerts();
  const router = useRouter();
  const limit = 10;

  const propertyTypeOptions: AdminSelectOption[] = [
    { value: '', label: 'All Types', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'house', label: 'House', badgeClassName: 'bg-blue-50 text-blue-700' },
    { value: 'apartment', label: 'Apartment', badgeClassName: 'bg-purple-50 text-purple-700' },
    { value: 'villa', label: 'Villa', badgeClassName: 'bg-green-50 text-green-700' },
    { value: 'commercial', label: 'Commercial', badgeClassName: 'bg-orange-50 text-orange-700' },
    { value: 'land', label: 'Land', badgeClassName: 'bg-emerald-50 text-emerald-700' },
  ];

  const listingOptions: AdminSelectOption[] = [
    { value: '', label: 'All Listings', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'ForSale', label: 'For Sale', badgeClassName: 'bg-blue-50 text-blue-700' },
    { value: 'ForRent', label: 'For Rent', badgeClassName: 'bg-purple-50 text-purple-700' },
  ];

  const publishStatusOptions: AdminSelectOption[] = [
    { value: '', label: 'All Status', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'publish', label: 'Published', badgeClassName: 'bg-green-50 text-green-700' },
    { value: 'draft', label: 'Draft', badgeClassName: 'bg-yellow-50 text-yellow-700' },
  ];

  const inlineStatusOptions: AdminSelectOption[] = [
    { value: 'publish', label: 'Published', badgeClassName: 'bg-green-100 text-green-700' },
    { value: 'draft', label: 'Draft', badgeClassName: 'bg-yellow-100 text-yellow-700' },
  ];

  const sortOptions: AdminSelectOption[] = [
    { value: 'newest', label: 'Newest', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'oldest', label: 'Oldest', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'price-asc', label: 'Price: Low to High', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'price-desc', label: 'Price: High to Low', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'title', label: 'Title A-Z', badgeClassName: 'bg-gray-100 text-gray-700' },
  ];

  const actionOptions: AdminSelectOption[] = [
    { value: 'preview', label: 'Preview', iconClassName: 'fas fa-eye text-blue-600' },
    { value: 'edit', label: 'Edit', iconClassName: 'fas fa-edit text-gray-500' },
    { value: 'delete', label: 'Delete', iconClassName: 'fas fa-trash text-red-600' },
  ];

  // Stats
  const [stats, setStats] = useState<{
    totalProperties: number;
    propertiesForSale: number;
    propertiesForRent: number;
    draftProperties: number;
    publishedProperties: number;
  } | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(console.error);
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedSearch) params.set('search', appliedSearch);
      if (propertyType) params.set('propertyType', propertyType);
      if (propertyStatus) params.set('propertyStatus', propertyStatus);
      if (status) params.set('status', status);
      params.set('sortBy', sortBy);
      params.set('page', String(currentPage));
      params.set('limit', String(limit));

      const res = await fetch(`/api/admin/properties?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, propertyType, propertyStatus, status, sortBy, currentPage, limit]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setAppliedSearch(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleFilterChange = (setter: (v: string) => void, value: string) => {
    setCurrentPage(1);
    setter(value);
  };

  const handlePropertyAction = (property: PropertyItem, action: string) => {
    if (!action) return;
    if (action === 'preview') {
      setPreviewProperty(property);
      return;
    }
    if (action === 'edit') {
      router.push(`/admin/add-property?propertyId=${property.id}`);
      return;
    }
    if (action === 'delete') {
      setConfirmDelete(property);
    }
  };

  const handleStatusUpdate = async (propertyId: string, newStatus: 'publish' | 'draft') => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            properties: prev.properties.map((prop) =>
              prop.id === propertyId ? { ...prop, status: newStatus } : prop
            ),
          }
        : prev
    );

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Update failed');
      }

      addAlert('success', `Status updated to ${newStatus === 'publish' ? 'Published' : 'Draft'}.`);
    } catch (err) {
      console.error('Inline status update failed:', err);
      addAlert('error', 'Failed to update status.');
      fetchProperties();
    }
  };

  const handleDeleteProperty = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/properties/${confirmDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Delete failed');
      }
      addAlert('success', `"${confirmDelete.title}" has been deleted.`);
      setConfirmDelete(null);
      fetchProperties();
    } catch (err) {
      console.error('Delete property failed:', err);
      addAlert('error', 'Failed to delete property.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = data?.totalPages || 1;

  const statCards = stats
    ? [
        { label: 'Total Properties', value: stats.totalProperties, icon: 'fa-building', bg: 'bg-blue-100', iconColor: 'text-blue-600' },
        { label: 'For Sale', value: stats.propertiesForSale, icon: 'fa-tag', bg: 'bg-green-100', iconColor: 'text-green-600' },
        { label: 'For Rent', value: stats.propertiesForRent, icon: 'fa-key', bg: 'bg-purple-100', iconColor: 'text-purple-600' },
        { label: 'Published', value: stats.publishedProperties, icon: 'fa-check-circle', bg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
        { label: 'Drafts', value: stats.draftProperties, icon: 'fa-file-alt', bg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
      ]
    : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Properties</h1>
        <Link
          href="/admin/add-property"
          className="bg-pink-600 text-white px-5 py-2.5 rounded-md hover:bg-pink-700 transition-colors font-medium"
        >
          <i className="fas fa-plus mr-2"></i>Add Property
        </Link>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center space-x-3">
              <div className={`${card.bg} rounded-lg p-2.5`}>
                <i className={`fas ${card.icon} text-lg ${card.iconColor}`}></i>
              </div>
              <div>
                <p className="text-xs text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-800">{card.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by title, address, city..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <AdminSelect
              value={propertyType}
              options={propertyTypeOptions}
              onChange={(value) => handleFilterChange(setPropertyType, value)}
              placeholder="All Types"
              buttonClassName="text-sm"
              className="w-full sm:w-48"
            />
            <AdminSelect
              value={propertyStatus}
              options={listingOptions}
              onChange={(value) => handleFilterChange(setPropertyStatus, value)}
              placeholder="Listing"
              buttonClassName="text-sm"
              className="w-full sm:w-48"
            />
            <AdminSelect
              value={status}
              options={publishStatusOptions}
              onChange={(value) => handleFilterChange(setStatus, value)}
              placeholder="Status"
              buttonClassName="text-sm"
              className="w-full sm:w-40"
            />
            <AdminSelect
              value={sortBy}
              options={sortOptions}
              onChange={(value) => handleFilterChange(setSortBy, value)}
              placeholder="Sort"
              buttonClassName="text-sm"
              className="w-full sm:w-48"
              showBadge={false}
            />
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Property</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Listing</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Location</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Beds/Baths</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Owner</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.properties.map((prop) => (
                    <tr key={prop.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          {prop.imageUrl ? (
                            <Image
                              src={prop.imageUrl}
                              alt={prop.title}
                              width={48}
                              height={36}
                              className="w-12 h-9 rounded object-cover"
                            />
                          ) : (
                            <div className="w-12 h-9 rounded bg-gray-200 flex items-center justify-center">
                              <i className="fas fa-image text-gray-400 text-xs"></i>
                            </div>
                          )}
                          <span className="font-medium text-gray-800 max-w-[180px] truncate">{prop.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">${prop.price.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="capitalize text-gray-600">{prop.propertyType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          prop.propertyStatus === 'ForSale' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {prop.propertyStatus === 'ForSale' ? 'For Sale' : 'For Rent'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <AdminSelect
                          value={prop.status}
                          options={inlineStatusOptions}
                          onChange={(value) => handleStatusUpdate(prop.id, value as 'publish' | 'draft')}
                          buttonClassName="text-xs"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-[140px] truncate">{prop.city}, {prop.state}</td>
                      <td className="py-3 px-4 text-gray-600">{prop.bedrooms}/{prop.bathrooms}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">{prop.user?.name || '—'}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{new Date(prop.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <AdminSelect
                          value=""
                          options={actionOptions}
                          onChange={(action) => handlePropertyAction(prop, action)}
                          placeholder="Actions"
                          showBadge={false}
                          fullWidth={false}
                          buttonClassName="text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                  {data?.properties.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-gray-400">
                        <i className="fas fa-building text-4xl mb-3 block"></i>
                        No properties found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data?.total || 0)} of {data?.total || 0} properties
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
                    .map((p, idx, arr) => (
                      <React.Fragment key={p}>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-2 py-1 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(p)}
                          className={`px-3 py-1 rounded border text-sm ${
                            currentPage === p
                              ? 'bg-blue-700 text-white border-blue-700'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Property Preview Modal */}
      {previewProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500">Property Preview</p>
                <h2 className="text-2xl font-bold text-gray-800">{previewProperty.title}</h2>
              </div>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setPreviewProperty(null)}
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {previewProperty.imageUrl && (
              <div className="relative h-64 w-full">
                <Image
                  src={previewProperty.imageUrl}
                  alt={previewProperty.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
            )}

            {previewProperty.images && previewProperty.images.length > 0 && (
              <div className="px-6 pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Gallery</p>
                  <span className="text-xs text-gray-500">{previewProperty.images.length} images</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {previewProperty.images.map((img, idx) => (
                    <div key={idx} className="relative h-24 rounded-lg overflow-hidden">
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${previewProperty.price.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Listing</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {previewProperty.propertyStatus === 'ForSale' ? 'For Sale' : 'For Rent'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {previewProperty.propertyType}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {previewProperty.status === 'publish' ? 'Published' : 'Draft'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bedrooms</p>
                  <p className="text-xl font-semibold text-gray-800">{previewProperty.bedrooms}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Bathrooms</p>
                  <p className="text-xl font-semibold text-gray-800">{previewProperty.bathrooms}</p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Area</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {previewProperty.area.toLocaleString()} {previewProperty.areaUnit || 'sqft'}
                  </p>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Garage Spaces</p>
                  <p className="text-xl font-semibold text-gray-800">{previewProperty.garageSpaces ?? '—'}</p>
                </div>
              </div>

              <div className="bg-white border rounded-lg p-5">
                <p className="text-sm font-semibold text-gray-700 mb-2">Description</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">
                  {previewProperty.description || 'No description provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Location</p>
                  <p className="text-gray-800 font-medium">
                    {previewProperty.address}, {previewProperty.city}, {previewProperty.state} {previewProperty.zipCode}
                  </p>
                  {previewProperty.location && (
                    <p className="text-xs text-gray-500 mt-1">Area: {previewProperty.location}</p>
                  )}
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Owner / Agent</p>
                  <p className="text-gray-800 font-semibold">
                    {previewProperty.user?.name || 'Unassigned'}
                  </p>
                  <p className="text-xs text-gray-500">{previewProperty.user?.email || 'No email on file'}</p>
                </div>
              </div>

              {previewProperty.amenities && previewProperty.amenities.length > 0 && (
                <div className="bg-white border rounded-lg p-5">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {previewProperty.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white border rounded-lg p-5 text-sm text-gray-500 space-y-1">
                <p><span className="font-semibold text-gray-700">Created:</span> {new Date(previewProperty.createdAt).toLocaleString()}</p>
                <p><span className="font-semibold text-gray-700">Property ID:</span> <span className="font-mono">{previewProperty.id}</span></p>
              </div>

              <div className="flex justify-end">
                <button
                  className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                  onClick={() => setPreviewProperty(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete Property"
        message={
          confirmDelete ? (
            <span>
              Are you sure you want to delete <strong>{confirmDelete.title}</strong>?<br />
              <span className="text-red-600 font-medium">This action cannot be undone.</span>
            </span>
          ) : ''
        }
        confirmLabel="Delete"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteProperty}
        onCancel={() => setConfirmDelete(null)}
      />

      <AdminAlert alerts={alerts} onDismiss={dismissAlert} />
    </div>
  );
};

export default AdminPropertiesPage;
