import React from 'react';

export const HomeIndicator = ({ dark = false, className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center pt-2 pb-2 select-none ${className}`}>
      <div
        className={`w-32 h-1 rounded-full transition-colors ${
          dark ? 'bg-white/40' : 'bg-gray-900/80'
        }`}
      />
    </div>
  );
};

export default HomeIndicator;

