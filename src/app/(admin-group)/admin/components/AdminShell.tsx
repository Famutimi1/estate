"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: 'fa-home' },
  { href: '/admin/users', label: 'Users', icon: 'fa-users' },
  { href: '/admin/properties', label: 'Properties', icon: 'fa-building' },
  { href: '/admin/add-property', label: 'Add Property', icon: 'fa-plus' },
  { href: '/admin/schedules', label: 'Schedules', icon: 'fa-calendar-alt' },
  { href: '/admin/contacts', label: 'Contacts', icon: 'fa-envelope' },
  { href: '/admin/settings', label: 'Settings', icon: 'fa-cog' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user: currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const desktopPaddingClass = desktopCollapsed ? 'md:pl-20' : 'md:pl-64';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      {/*
        Mobile: hidden off-screen by default (-translate-x-full), slides in when sidebarOpen
        Desktop: always visible, toggles between w-20 (icons only) and w-64 (full)
      */}
      <div className={`bg-white shadow-lg z-30 transition-all duration-300 fixed h-full
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-50
        md:translate-x-0 ${desktopCollapsed ? 'md:w-20' : 'md:w-64'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className={`flex items-center ${desktopCollapsed ? 'md:justify-center md:w-full' : ''}`}>
            <Link href="/">
              <img
                src="/company_logo/company_logo.png"
                alt="Company Logo"
                style={{ width: desktopCollapsed ? '24px' : '100px', height: '100px' }}
                className="object-contain"
              />
            </Link>
          </div>
          {/* Mobile: X close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-green-700 cursor-pointer md:hidden"
          >
            <i className="fas fa-times"></i>
          </button>
          {/* Desktop: collapse/expand chevron */}
          <button
            onClick={() => setDesktopCollapsed(!desktopCollapsed)}
            className="text-gray-500 hover:text-green-700 cursor-pointer hidden md:block"
          >
            <i className={`fas ${desktopCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            {navItems.map((item) => {
              const isActive = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center py-3 px-4 transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-700'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    <i className={`fas ${item.icon} text-lg w-8`}></i>
                    {/* Hide label only on desktop when collapsed */}
                    <span className={`${desktopCollapsed ? 'md:hidden' : ''}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 min-h-screen w-full transition-[padding] duration-300 ${desktopPaddingClass}`}>
        {/* Top Navigation */}
        <div className="bg-green-800 text-white shadow-md sticky top-0 z-10">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger toggle - always in DOM, hidden on md+ via CSS */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="text-white hover:text-green-200 cursor-pointer md:hidden"
                >
                  <i className="fas fa-bars text-xl"></i>
                </button>
                <div className="relative hidden md:block md:w-64">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-green-700 text-white placeholder-green-300 border-none rounded-sm py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <i className="fas fa-search absolute left-3 top-3 text-green-300"></i>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="text-white hover:text-green-200 cursor-pointer"
                  >
                    <i className="fas fa-bell text-xl"></i>
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-sm shadow-lg z-10">
                      <div className="p-3 border-b border-gray-200">
                        <h3 className="text-gray-800 font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <a href="#" className="block p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                              <i className="fas fa-user-plus text-green-700"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">New user registered</p>
                              <p className="text-xs text-gray-500 mt-1">30 minutes ago</p>
                            </div>
                          </div>
                        </a>
                        <a href="#" className="block p-4 border-b border-gray-100 hover:bg-gray-50">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                              <i className="fas fa-check text-green-600"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-800">Property approved</p>
                              <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div className="p-2 border-t border-gray-200 text-center">
                        <a href="#" className="text-sm text-green-700 hover:underline">View all notifications</a>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <Image
                      src={currentUser?.avatar_url || 'https://readdy.ai/api/search-image?query=Professional%2520headshot%2520of%2520a%2520real%2520estate%2520agent%2520with%2520confident%2520smile%2520business%2520attire%2520neutral%2520background%2520high%2520quality%2520portrait%2520photography%2520with%2520soft%2520lighting%2520and%2520shallow%2520depth%2520of%2520field%2520professional%2520appearance&width=40&height=40&seq=1&orientation=squarish'}
                      alt="User"
                      width={40}
                      height={40}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="hidden md:inline">{currentUser?.name?.split(' ')[0] || 'Admin'}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-lg z-10">
                      <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-user mr-2 text-gray-600"></i>
                        Profile
                      </a>
                      <Link href="/admin/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-cog mr-2 text-gray-600"></i>
                        Settings
                      </Link>
                      <div className="border-t border-gray-100"></div>
                      <Link href="/auth/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        <i className="fas fa-sign-out-alt mr-2 text-gray-600"></i>
                        Logout
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </div>
    </div>
  );
}
