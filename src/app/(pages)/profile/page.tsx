"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/useProfile";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, error, updateProfile, deleteAccount, changePassword, uploadAvatar, clearError } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Starting avatar upload:', file.name, file.type, file.size);
    
    setIsUploadingAvatar(true);
    setUploadSuccess(false);
    
    try {
      const result = await uploadAvatar(file);
      console.log('Upload result:', result);
      
      if (result.success) {
        console.log('Avatar uploaded successfully!');
        console.log('New avatar URL:', result.avatarUrl);
        console.log('User data before refresh:', user);
        
        setUploadSuccess(true);
        setAvatarTimestamp(Date.now()); // Force image refresh
        
        // Force a small delay to ensure the user data is updated
        setTimeout(() => {
          console.log('Current user data after upload:', user);
          console.log('Avatar URL in user data:', user?.avatar_url);
          console.log('Avatar timestamp:', avatarTimestamp);
        }, 1000);
        
        // Hide success message after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        console.error('Upload failed:', result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }
    
    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    if (result.success) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      return;
    }
    
    const result = await deleteAccount();
    if (result.success) {
      router.push("/auth");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-500 hover:text-red-700 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Account</p>
          <h1 className="text-3xl font-bold text-gray-900">Profile Overview</h1>
        </div>
        <Link
          href="/favorites"
          className="px-4 py-2 rounded-sm bg-pink-600 text-white text-sm font-medium hover:bg-pink-700 transition-colors"
        >
          View Favorites
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Picture Section */}
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div className="flex flex-col items-center">
            {uploadSuccess && (
              <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg w-full">
                <p className="text-green-700 text-sm text-center">✅ Profile picture updated successfully!</p>
              </div>
            )}
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                {isUploadingAvatar ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : (
                  <img
                    key={avatarTimestamp} // Force re-render when timestamp changes
                    src={user?.avatar_url ? `${user.avatar_url}?t=${avatarTimestamp}` : "https://readdy.ai/api/search-image?query=Professional%20headshot%20placeholder%20for%20user%20profile%20picture%20neutral%20background%20default%20avatar&width=128&height=128&seq=1&orientation=squarish"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button
                onClick={handleAvatarClick}
                disabled={isUploadingAvatar}
                className={`absolute bottom-0 right-0 text-white p-2 rounded-full transition-colors shadow-lg ${
                  isUploadingAvatar 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                title={isUploadingAvatar ? "Uploading..." : "Change profile picture"}
              >
                {isUploadingAvatar ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploadingAvatar}
              className="hidden"
            />
            <p className="text-sm text-gray-500 text-center">
              {isUploadingAvatar ? "Uploading..." : "Click the camera icon to upload a new profile picture"}
            </p>
            <p className="text-xs text-gray-400 text-center mt-1">
              JPG, PNG, GIF, WebP (Max 5MB)
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Personal Details</h2>
            {!isEditing && (
              <button
                onClick={() => {
                  setIsEditing(true);
                  setFormData({
                    name: user?.name || "",
                    phone: user?.phone || "",
                  });
                }}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Edit
              </button>
            )}
          </div>
          
          {!isEditing ? (
            <dl className="space-y-3 text-sm text-gray-700">
              <div>
                <dt className="font-medium text-gray-500">Full name</dt>
                <dd className="text-gray-900">{user?.name || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Email address</dt>
                <dd className="text-gray-900">{user?.email || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Phone</dt>
                <dd className="text-gray-900">{user?.phone || "Not provided"}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-500">Role</dt>
                <dd className="text-gray-900 capitalize">{user?.role || "user"}</dd>
              </div>
            </dl>
          ) : (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  minLength={2}
                  maxLength={255}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="+1234567890"
                  maxLength={50}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="w-full rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Change Password
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full rounded-sm border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Delete Account
            </button>
          </div>
        </section>

      </div>

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                  minLength={6}
                />
                {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || passwordData.newPassword !== passwordData.confirmPassword}
                  className="flex-1 px-4 py-2 bg-pink-600 text-white text-sm font-medium rounded-sm hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Account</h3>
            
            <div className="mb-4">
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <p className="text-sm text-gray-500 mb-4">
                This will permanently delete:
              </p>
              <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                <li>Your profile information</li>
                <li>Your favorite properties</li>
                <li>Contact messages and schedule requests</li>
              </ul>
            </div>

            <div className="mb-6">
              <label htmlFor="confirm" className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-mono bg-gray-100 px-1">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                id="confirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="DELETE"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "DELETE" || loading}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
