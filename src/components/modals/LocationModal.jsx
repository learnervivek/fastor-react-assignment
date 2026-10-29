import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';

const CITIES = [
  { id: '118', name: 'Model Town, New Delhi', state: 'Delhi NCR' },
  { id: '119', name: 'Connaught Place, Central Delhi', state: 'Delhi NCR' },
  { id: '120', name: 'Indiranagar, Bangalore', state: 'Karnataka' },
  { id: '121', name: 'Bandra West, Mumbai', state: 'Maharashtra' },
  { id: '122', name: 'Sector 29, Gurgaon', state: 'Haryana' },
];

export const LocationModal = ({ isOpen, onClose, selectedLocation, onSelectLocation }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-bold text-gray-900">Select Delivery Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Choose your delivery sector to browse nearby restaurants and popular food items.
        </p>

        <div className="mt-4 space-y-2 overflow-y-auto flex-1 pr-1">
          {CITIES.map((city) => {
            const isSelected = selectedLocation.name === city.name;
            return (
              <div
                key={city.id}
                onClick={() => {
                  onSelectLocation(city);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-brand-orange bg-brand-orange/5'
                    : 'border-gray-100 hover:border-gray-300 bg-white'
                }`}
              >
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{city.name}</h4>
                  <p className="text-[11px] text-gray-400">{city.state}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-brand-orange" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;

