"use client";

export default function FavoritesPage() {
  const favorites = [
    {
      id: 1,
      title: "Stylish Ikoyi Apartment",
      location: "Ikoyi, Lagos",
      price: 185000000,
      status: "For Sale",
    },
    {
      id: 2,
      title: "Lekki Phase 1 Duplex",
      location: "Lekki, Lagos",
      price: 7500000,
      status: "For Rent",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500">Saved homes</p>
          <h1 className="text-3xl font-bold text-gray-900">Favorites</h1>
        </div>
      </div>

      <div className="space-y-4">
        {favorites.map((fav) => (
          <div key={fav.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{fav.status}</p>
              <h2 className="text-xl font-semibold text-gray-900">{fav.title}</h2>
              <p className="text-gray-600 text-sm">{fav.location}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-700">₦{fav.price.toLocaleString()}</p>
              <button className="mt-2 rounded-sm border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
