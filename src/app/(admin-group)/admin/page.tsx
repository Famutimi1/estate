"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type ChartDatum = { label: string; value: number };

interface ChartCardProps {
  title: string;
  description: string;
  data: ChartDatum[];
  gradientId: string;
  accent: string;
  variant: 'area' | 'line';
}

const ChartCard: React.FC<ChartCardProps> = ({ title, description, data, gradientId, accent, variant }) => {
  const [hoveredPoint, setHoveredPoint] = React.useState<{ x: number; y: number; label: string; value: number } | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  const normalizedData = data.length > 1 ? data : [...data, ...data];
  const maxValue = Math.max(...normalizedData.map((d) => d.value), 1);
  const points = normalizedData.map((point, index) => {
    const x = (index / (normalizedData.length - 1)) * 100;
    const y = 100 - (point.value / maxValue) * 80 - 10;
    return { ...point, x, y };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

  const firstLabel = normalizedData[0]?.label || '';
  const lastLabel = normalizedData[normalizedData.length - 1]?.label || '';

  const yAxisTicks = [0, 1, 2, 3, 4].map((i) => ({
    value: Math.round((maxValue * (4 - i)) / 4),
    y: 10 + (i * 80) / 4,
  }));

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    
    let closestPoint = points[0];
    let minDistance = Math.abs(x - points[0].x);
    
    points.forEach((point) => {
      const distance = Math.abs(x - point.x);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    if (minDistance < 8) {
      setHoveredPoint(closestPoint);
    } else {
      setHoveredPoint(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 pr-2">
          {yAxisTicks.map((tick) => (
            <span key={tick.value}>{tick.value.toLocaleString()}</span>
          ))}
        </div>
        <div className="ml-10 relative">
          <svg 
            ref={svgRef}
            viewBox="0 0 100 100" 
            className="w-full h-52 cursor-crosshair"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={accent} stopOpacity={variant === 'area' ? 0.2 : 0} />
                <stop offset="100%" stopColor={accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <g fill="none" stroke="none">
              {variant === 'area' && (
                <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
              )}
              <path d={linePath} stroke={accent} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {points.map((point, idx) => (
                <circle 
                  key={point.label} 
                  cx={point.x} 
                  cy={point.y} 
                  r={hoveredPoint?.label === point.label ? 4 : 2.5} 
                  fill={accent} 
                  opacity={hoveredPoint?.label === point.label ? 1 : (idx === 0 || idx === points.length - 1 ? 0.8 : 0)} 
                  className="transition-all duration-150"
                />
              ))}
            </g>
            <g stroke="#e5e7eb" strokeWidth="0.5" opacity="0.5">
              {[25, 50, 75].map((y) => (
                <line key={y} x1="0" y1={y} x2="100" y2={y} strokeDasharray="3,3" />
              ))}
            </g>
            {hoveredPoint && (
              <g>
                <line 
                  x1={hoveredPoint.x} 
                  y1="0" 
                  x2={hoveredPoint.x} 
                  y2="100" 
                  stroke={accent} 
                  strokeWidth="0.5" 
                  strokeDasharray="2,2" 
                  opacity="0.3"
                />
              </g>
            )}
          </svg>
          {hoveredPoint && (
            <div 
              className="absolute bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none z-10"
              style={{
                left: `${hoveredPoint.x}%`,
                top: `${hoveredPoint.y * 0.52}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <div className="font-semibold">{hoveredPoint.label}</div>
              <div className="text-gray-300">{hoveredPoint.value.toLocaleString()}</div>
            </div>
          )}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-4 ml-10">
          <span>{firstLabel}</span>
          <span>{lastLabel}</span>
        </div>
      </div>
    </div>
  );
};

interface Stats {
  totalUsers: number;
  totalProperties: number;
  totalFavorites: number;
  propertiesForSale: number;
  propertiesForRent: number;
  draftProperties: number;
  publishedProperties: number;
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
  recentProperties: { id: string; title: string; price: number; propertyStatus: string; status: string; city: string; state: string; createdAt: string }[];
}

interface MonthlyStats {
  monthlyData: { month: string; users: number; properties: number }[];
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, monthlyRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/stats/monthly'),
        ]);
        const statsData = await statsRes.json();
        const monthlyData = await monthlyRes.json();
        setStats(statsData);
        setMonthlyStats(monthlyData);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (!stats || !monthlyStats) {
    return <p className="text-red-500">Failed to load dashboard data.</p>;
  }

  const summaryCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: 'fa-users', bg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Total Properties', value: stats.totalProperties, icon: 'fa-building', bg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'For Sale', value: stats.propertiesForSale, icon: 'fa-tag', bg: 'bg-orange-100', iconColor: 'text-orange-600' },
    { label: 'For Rent', value: stats.propertiesForRent, icon: 'fa-key', bg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Published', value: stats.publishedProperties, icon: 'fa-check-circle', bg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Drafts', value: stats.draftProperties, icon: 'fa-file-alt', bg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { label: 'Favorites', value: stats.totalFavorites, icon: 'fa-heart', bg: 'bg-pink-100', iconColor: 'text-pink-600' },
  ];

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const userTrend = monthlyStats.monthlyData.map((item) => ({
    label: formatMonthLabel(item.month),
    value: item.users,
  }));

  const listingTrend = monthlyStats.monthlyData.map((item) => ({
    label: formatMonthLabel(item.month),
    value: item.properties,
  }));

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => (
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

      {/* Performance Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard
          title="User Signups"
          description=""
          data={userTrend}
          gradientId="usersGradient"
          accent="#34d399"
          variant="line"
        />
        <ChartCard
          title="Property Listings"
          description=""
          data={listingTrend}
          gradientId="listingsGradient"
          accent="#60a5fa"
          variant="area"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/add-property" className="bg-pink-600 text-white px-5 py-2.5 rounded-md hover:bg-pink-700 transition-colors font-medium">
            <i className="fas fa-plus mr-2"></i>Add Property
          </Link>
          <Link href="/admin/properties" className="bg-blue-700 text-white px-5 py-2.5 rounded-md hover:bg-blue-800 transition-colors font-medium">
            <i className="fas fa-building mr-2"></i>View Properties
          </Link>
          <Link href="/admin/users" className="bg-emerald-600 text-white px-5 py-2.5 rounded-md hover:bg-emerald-700 transition-colors font-medium">
            <i className="fas fa-users mr-2"></i>Manage Users
          </Link>
          <Link href="/admin/settings" className="bg-gray-600 text-white px-5 py-2.5 rounded-md hover:bg-gray-700 transition-colors font-medium">
            <i className="fas fa-cog mr-2"></i>Settings
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Properties</h2>
            <Link href="/admin/properties" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Title</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Price</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentProperties.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-800 max-w-[150px] truncate">{p.title}</td>
                    <td className="py-3 px-2 text-gray-600">${p.price.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        p.propertyStatus === 'ForSale' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {p.propertyStatus === 'ForSale' ? 'For Sale' : 'For Rent'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {stats.recentProperties.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-gray-400">No properties yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Role</th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium text-gray-800">{u.name}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-[150px] truncate">{u.email}</td>
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' :
                        u.role === 'agent' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {stats.recentUsers.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-gray-400">No users yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Property Type Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Property Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-700">{stats.propertiesForSale}</p>
            <p className="text-sm text-gray-600 mt-1">For Sale</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-700">{stats.propertiesForRent}</p>
            <p className="text-sm text-gray-600 mt-1">For Rent</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-700">{stats.publishedProperties}</p>
            <p className="text-sm text-gray-600 mt-1">Published</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-3xl font-bold text-yellow-700">{stats.draftProperties}</p>
            <p className="text-sm text-gray-600 mt-1">Drafts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
