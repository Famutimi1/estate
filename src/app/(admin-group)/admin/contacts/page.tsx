"use client";

import React, { useEffect, useState, useCallback } from 'react';
import AdminSelect, { AdminSelectOption } from '../components/AdminSelect';
import AdminAlert, { useAlerts } from '../components/AdminAlert';
import ConfirmModal from '../components/ConfirmModal';

interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

interface ContactsResponse {
  contacts: ContactItem[];
}

const AdminContactsPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ContactItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { alerts, addAlert, dismissAlert } = useAlerts();

  const statusFilterOptions: AdminSelectOption[] = [
    { value: '', label: 'All Statuses', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'unread', label: 'Unread', badgeClassName: 'bg-yellow-50 text-yellow-700' },
    { value: 'read', label: 'Read', badgeClassName: 'bg-pink-50 text-pink-700' },
    { value: 'replied', label: 'Replied', badgeClassName: 'bg-green-50 text-green-700' },
    { value: 'archived', label: 'Archived', badgeClassName: 'bg-gray-50 text-gray-700' },
  ];

  const statusOptions: AdminSelectOption[] = [
    { value: 'unread', label: 'Unread', badgeClassName: 'bg-yellow-50 text-yellow-700' },
    { value: 'read', label: 'Read', badgeClassName: 'bg-pink-50 text-pink-700' },
    { value: 'replied', label: 'Replied', badgeClassName: 'bg-green-50 text-green-700' },
    { value: 'archived', label: 'Archived', badgeClassName: 'bg-gray-50 text-gray-700' },
  ];

  const actionOptions: AdminSelectOption[] = [
    { value: 'view', label: 'View', iconClassName: 'fas fa-eye text-green-600' },
    { value: 'reply', label: 'Reply', iconClassName: 'fas fa-reply text-green-600' },
    { value: 'delete', label: 'Delete', iconClassName: 'fas fa-trash text-red-600' },
  ];

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/contacts?${params.toString()}`);
      const json: ContactsResponse = await res.json();
      setContacts(json.contacts || []);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      addAlert('error', 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, addAlert]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleActionSelect = (contact: ContactItem, action: string) => {
    if (action === 'view') {
      setSelectedContact(contact);
      if (contact.status === 'unread') {
        handleStatusChange(contact.id, 'read');
      }
    } else if (action === 'reply') {
      window.location.href = `mailto:${contact.email}?subject=Re: Your inquiry`;
    } else if (action === 'delete') {
      setConfirmDelete(contact);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/contacts/${confirmDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete contact');

      addAlert('success', 'Contact deleted successfully');
      setConfirmDelete(null);
      fetchContacts();
    } catch (err) {
      console.error('Failed to delete contact:', err);
      addAlert('error', 'Failed to delete contact');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contacts/${contactId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      addAlert('success', 'Status updated successfully');
      fetchContacts();
    } catch (err) {
      console.error('Failed to update status:', err);
      addAlert('error', 'Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.badgeClassName : 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <AdminAlert alerts={alerts} onDismiss={dismissAlert} />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Contact Messages</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-sm shadow-md mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <AdminSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusFilterOptions}
              placeholder="Filter by status"
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-sm shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <i className="fas fa-envelope-open text-4xl mb-4"></i>
            <p>No contact messages found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message Preview
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                      <div className="text-sm text-gray-500">{contact.email}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{formatDate(contact.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(contact.status)}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <AdminSelect
                        value=""
                        options={actionOptions}
                        onChange={(action) => handleActionSelect(contact, action)}
                        placeholder="Actions"
                        showBadge={false}
                        fullWidth={false}
                        buttonClassName="text-sm"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Contact Message</h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedContact.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedContact.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="bg-gray-50 p-4 rounded-sm">
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <AdminSelect
                    value={selectedContact.status}
                    onChange={(newStatus) => handleStatusChange(selectedContact.id, newStatus)}
                    options={statusOptions}
                    placeholder="Select status"
                    fullWidth
                  />
                </div>

                <div className="text-sm text-gray-500">
                  <p>Received on: {formatDate(selectedContact.createdAt)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: Your inquiry`}
                  className="px-4 py-2 bg-green-600 text-white rounded-sm hover:bg-green-700"
                >
                  <i className="fas fa-reply mr-2"></i>
                  Reply via Email
                </a>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <ConfirmModal
          open={!!confirmDelete}
          title="Delete Contact Message"
          message={`Are you sure you want to delete the contact message from ${confirmDelete.name}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default AdminContactsPage;
