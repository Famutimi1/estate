"use client";

import React, { useEffect, useState, useCallback } from 'react';
import AdminSelect, { AdminSelectOption } from '../components/AdminSelect';
import AdminAlert, { useAlerts } from '../components/AdminAlert';
import ConfirmModal from '../components/ConfirmModal';

interface ScheduleItem {
  id: string;
  preferredDate: string;
  preferredTime: string;
  name: string;
  phone: string;
  email: string;
  viewerType: string;
  message: string | null;
  propertyId: string | null;
  propertyTitle: string | null;
  status: string;
  createdAt: string;
}

interface SchedulesResponse {
  schedules: ScheduleItem[];
}

const AdminSchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ScheduleItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { alerts, addAlert, dismissAlert } = useAlerts();

  const statusFilterOptions: AdminSelectOption[] = [
    { value: '', label: 'All Statuses', badgeClassName: 'bg-gray-100 text-gray-700' },
    { value: 'pending', label: 'Pending', badgeClassName: 'bg-yellow-50 text-yellow-700' },
    { value: 'confirmed', label: 'Confirmed', badgeClassName: 'bg-green-50 text-green-700' },
    { value: 'completed', label: 'Completed', badgeClassName: 'bg-pink-50 text-pink-700' },
    { value: 'cancelled', label: 'Cancelled', badgeClassName: 'bg-red-50 text-red-700' },
  ];

  const statusOptions: AdminSelectOption[] = [
    { value: 'pending', label: 'Pending', badgeClassName: 'bg-yellow-50 text-yellow-700' },
    { value: 'confirmed', label: 'Confirmed', badgeClassName: 'bg-green-50 text-green-700' },
    { value: 'completed', label: 'Completed', badgeClassName: 'bg-pink-50 text-pink-700' },
    { value: 'cancelled', label: 'Cancelled', badgeClassName: 'bg-red-50 text-red-700' },
  ];

  const actionOptions: AdminSelectOption[] = [
    { value: 'view', label: 'View', iconClassName: 'fas fa-eye text-green-600' },
    { value: 'delete', label: 'Delete', iconClassName: 'fas fa-trash text-red-600' },
  ];

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const res = await fetch(`/api/schedules?${params.toString()}`);
      const json: SchedulesResponse = await res.json();
      setSchedules(json.schedules || []);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      addAlert('error', 'Failed to load schedules');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, addAlert]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleActionSelect = (schedule: ScheduleItem, action: string) => {
    if (action === 'view') {
      setSelectedSchedule(schedule);
    } else if (action === 'delete') {
      setConfirmDelete(schedule);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/schedules/${confirmDelete.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete schedule');

      addAlert('success', 'Schedule deleted successfully');
      setConfirmDelete(null);
      fetchSchedules();
    } catch (err) {
      console.error('Failed to delete schedule:', err);
      addAlert('error', 'Failed to delete schedule');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (scheduleId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      addAlert('success', 'Status updated successfully');
      fetchSchedules();
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
        <h1 className="text-3xl font-bold text-gray-800">Schedule Requests</h1>
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

      {/* Schedules Table */}
      <div className="bg-white rounded-sm shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : schedules.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <i className="fas fa-calendar-times text-4xl mb-4"></i>
            <p>No schedule requests found</p>
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
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preferred Date/Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Viewer Type
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
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                      <div className="text-sm text-gray-500">{schedule.email}</div>
                      <div className="text-sm text-gray-500">{schedule.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{schedule.propertyTitle || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{formatDate(schedule.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{schedule.preferredDate}</div>
                      <div className="text-sm text-gray-500">{schedule.preferredTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-pink-100 text-pink-800">
                        {schedule.viewerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(schedule.status)}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <AdminSelect
                        value=""
                        options={actionOptions}
                        onChange={(action) => handleActionSelect(schedule, action)}
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
      {selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Schedule Details</h2>
                <button
                  onClick={() => setSelectedSchedule(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{selectedSchedule.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedSchedule.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedSchedule.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                    <p className="text-gray-900">{selectedSchedule.preferredDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                    <p className="text-gray-900">{selectedSchedule.preferredTime}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Viewer Type</label>
                  <p className="text-gray-900 capitalize">{selectedSchedule.viewerType}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                  <p className="text-gray-900">{selectedSchedule.propertyTitle || 'N/A'}</p>
                </div>

                {selectedSchedule.message && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <p className="text-gray-900 whitespace-pre-wrap">{selectedSchedule.message}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                  <AdminSelect
                    value={selectedSchedule.status}
                    onChange={(newStatus) => handleStatusChange(selectedSchedule.id, newStatus)}
                    options={statusOptions}
                    placeholder="Select status"
                    fullWidth
                  />
                </div>

                <div className="text-sm text-gray-500">
                  <p>Requested on: {formatDate(selectedSchedule.createdAt)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedSchedule(null)}
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
          title="Delete Schedule Request"
          message={`Are you sure you want to delete the schedule request from ${confirmDelete.name}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
};

export default AdminSchedulesPage;
