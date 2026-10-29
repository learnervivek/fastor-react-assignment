import React from 'react';

export const RestaurantSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-3" role="status" aria-label="Loading restaurants">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-start space-x-3.5 animate-pulse"
        >
          {/* Image skeleton */}
          <div className="w-18 h-18 bg-gray-200 rounded-2xl shrink-0" />

          {/* Text lines */}
          <div className="flex-1 space-y-2.5 py-1">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded-md w-3/5" />
              <div className="h-4 bg-gray-100 rounded-md w-12" />
            </div>

            <div className="h-3 bg-gray-100 rounded-md w-4/5" />

            <div className="flex items-center justify-between pt-1">
              <div className="h-3 bg-gray-100 rounded-md w-14" />
              <div className="h-6 bg-gray-200 rounded-full w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RestaurantSkeleton;

