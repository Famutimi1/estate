"use client";

import React, { useEffect, useState, useCallback } from 'react';
import AdminSelect, { AdminSelectOption } from '../components/AdminSelect';
import AdminAlert, { useAlerts } from '../components/AdminAlert';
import ConfirmModal from '../components/ConfirmModal';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl: string | null;
  _count: { properties: number; favorites: number };
}

interface UsersResponse {
  users: UserItem[];
  total: number;
  totalAll: number;
  adminCount: number;
  agentCount: number;
  userCount: number;
  page: number;
  limit: number;
  totalPages: number;
}

const AdminUsersPage: React.FC = () => {
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<UserItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { alerts, addAlert, dismissAlert } = useAlerts();
  const limit = 10;

  const roleOptions: AdminSelectOption[] = [
    {
      value: 'admin',
      label: 'Admin',
      description: '',
      badgeClassName: 'bg-red-50 text-red-700',
    },
    {
      value: 'agent',
      label: 'Agent',
      description: '',
      badgeClassName: 'bg-orange-50 text-orange-700',
    },
    {
      value: 'user',
      label: 'User',
      description: '',
      badgeClassName: 'bg-gray-100 text-gray-700',
    },
  ];

  const roleFilterOptions: AdminSelectOption[] = [
    { value: '', label: 'All roles', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'user', label: 'Users', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'agent', label: 'Agents', badgeClassName: 'bg-orange-50 text-orange-700' },
    { value: 'admin', label: 'Admins', badgeClassName: 'bg-red-50 text-red-700' },
  ];

  const actionOptions: AdminSelectOption[] = [
    { value: 'preview', label: 'Preview', iconClassName: 'fas fa-eye text-green-600' },
    { value: 'edit', label: 'Edit', iconClassName: 'fas fa-edit text-gray-500' },
    { value: 'delete', label: 'Delete', iconClassName: 'fas fa-trash text-red-600' },
  ];

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedSearch) params.set('search', appliedSearch);
      if (roleFilter) params.set('role', roleFilter);
      params.set('page', String(currentPage));
      params.set('limit', String(limit));

      const res = await fetch(`/api/admin/users?${params.toString()}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [appliedSearch, roleFilter, currentPage, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1);
      setAppliedSearch(search);
    }, 400);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleRoleChange = (role: string) => {
    setCurrentPage(1);
    setRoleFilter(role);
  };

  const handleClearFilters = () => {
    setSearch('');
    setAppliedSearch('');
    setRoleFilter('');
    setCurrentPage(1);
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    const previousData = data;

    // Optimistic update
    setData((prev) =>
      prev
        ? {
            ...prev,
            users: prev.users.map((u) =>
              u.id === userId ? { ...u, role: newRole } : u
            ),
          }
        : prev
    );

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        throw new Error('Failed to update role');
      }
      addAlert('success', `User role updated to ${newRole}.`);
    } catch (err) {
      console.error('Role update failed:', err);
      addAlert('error', 'Failed to update user role. Change reverted.');
      setData(previousData);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDelete) return;
    setDeleteLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${confirmDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete user');
      }

      addAlert('success', `"${confirmDelete.name}" has been deleted.`);
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Delete user failed:', err);
      addAlert('error', 'Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleActionSelect = (user: UserItem, action: string) => {
    if (!action) return;
    if (action === 'preview') {
      setSelectedUser(user);
      return;
    }
    if (action === 'edit') {
      console.log('Edit user', user.id);
      return;
    }
    if (action === 'delete') {
      setConfirmDelete(user);
    }
  };

  const totalPages = data?.totalPages || 1;

  const statCards = data
    ? [
        { label: 'Total Users', value: data.totalAll, icon: 'fa-users', bg: 'bg-green-100', iconColor: 'text-green-600' },
        { label: 'Regular Users', value: data.userCount, icon: 'fa-user', bg: 'bg-green-100', iconColor: 'text-green-600' },
        { label: 'Agents', value: data.agentCount, icon: 'fa-user-tie', bg: 'bg-orange-100', iconColor: 'text-orange-600' },
        { label: 'Admins', value: data.adminCount, icon: 'fa-user-shield', bg: 'bg-red-100', iconColor: 'text-red-600' },
      ]
    : [];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 flex items-center space-x-4">
              <div className={`${card.bg} rounded-lg p-3`}>
                <i className={`fas ${card.icon} text-xl ${card.iconColor}`}></i>
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-800">{card.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <AdminSelect
              value={roleFilter}
              options={roleFilterOptions}
              onChange={handleRoleChange}
              placeholder="All roles"
              buttonClassName="text-sm"
              className="w-full md:w-48"
            />
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-visible">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            <div className="relative overflow-visible">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Email</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Role</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Properties</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Favorites</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Joined</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users.map((user) => (
                    <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user.email}</td>
                      <td className="py-3 px-4">
                        <AdminSelect
                          value={user.role}
                          options={roleOptions}
                          onChange={(newRole) => handleRoleUpdate(user.id, newRole)}
                          buttonClassName="text-xs"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-600">{user._count.properties}</td>
                      <td className="py-3 px-4 text-gray-600">{user._count.favorites}</td>
                      <td className="py-3 px-4 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <AdminSelect
                          value=""
                          options={actionOptions}
                          onChange={(action) => handleActionSelect(user, action)}
                          placeholder="Actions"
                          showBadge={false}
                          fullWidth={false}
                          buttonClassName="text-sm"
                        />
                      </td>
                    </tr>
                  ))}
                  {data?.users.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400">
                        <i className="fas fa-users text-4xl mb-3 block"></i>
                        No users found
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
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, data?.total || 0)} of {data?.total || 0} users
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
                              ? 'bg-green-700 text-white border-green-700'
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedUser.role}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-semibold text-gray-800">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Properties</p>
                  <p className="font-semibold text-gray-800">{selectedUser._count.properties}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">Favorites</p>
                  <p className="font-semibold text-gray-800">{selectedUser._count.favorites}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 col-span-2">
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-xs text-gray-600 break-all">{selectedUser.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Alert Toasts */}
      <AdminAlert alerts={alerts} onDismiss={dismissAlert} />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={!!confirmDelete}
        title="Delete User"
        message={
          confirmDelete ? (
            <span>
              Are you sure you want to delete <strong>{confirmDelete.name}</strong>?
              This will also remove their properties and favorites.
              <br />
              <span className="text-red-600 font-medium">This action cannot be undone.</span>
            </span>
          ) : ''
        }
        confirmLabel="Delete User"
        variant="danger"
        loading={deleteLoading}
        onConfirm={handleDeleteUser}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
