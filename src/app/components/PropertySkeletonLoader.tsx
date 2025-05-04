import React from 'react';

const PropertySkeletonLoader: React.FC = () => {
  // Create an array of 6 items to display in the grid
  const skeletons = Array(6).fill(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {skeletons.map((_, index) => (
        <div key={index} className="bg-white rounded-sm shadow-md overflow-hidden animate-pulse">
          {/* Image placeholder */}
          <div className="relative">
            <div className="w-full h-64 bg-gray-300"></div>
            {/* Status tag placeholder */}
            <div className="absolute top-4 left-4 bg-gray-300 w-20 h-6 rounded"></div>
            {/* Action buttons placeholder */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Content placeholder */}
          <div className="p-6">
            {/* Title and price */}
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-300 w-3/5 rounded"></div>
              <div className="h-6 bg-gray-300 w-1/4 rounded"></div>
            </div>
            
            {/* Address */}
            <div className="h-5 bg-gray-300 w-4/5 rounded mb-4"></div>
            
            {/* Property details */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div className="h-5 bg-gray-300 w-1/4 rounded"></div>
              <div className="h-5 bg-gray-300 w-1/4 rounded"></div>
              <div className="h-5 bg-gray-300 w-1/4 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertySkeletonLoader;