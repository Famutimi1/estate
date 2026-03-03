"use client";

import Link from "next/link";

export default function ProfilePage() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    phone: "+234 800 000 0000",
    role: "Home Buyer",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
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
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Details</h2>
          <dl className="space-y-3 text-sm text-gray-700">
            <div>
              <dt className="font-medium text-gray-500">Full name</dt>
              <dd className="text-gray-900">{user.name}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Email address</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Phone</dt>
              <dd className="text-gray-900">{user.phone}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">Role</dt>
              <dd className="text-gray-900">{user.role}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Actions</h2>
          <div className="space-y-3">
            <button className="w-full rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Update Profile
            </button>
            <button className="w-full rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Change Password
            </button>
            <button className="w-full rounded-sm border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
