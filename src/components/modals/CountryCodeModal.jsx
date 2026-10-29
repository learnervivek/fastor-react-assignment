import React, { useState } from 'react';
import { X, Search, Check } from 'lucide-react';

const COUNTRY_CODES = [
  { name: 'India', code: '+91', flag: '🇮🇳' },
  { name: 'United States', code: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬' },
  { name: 'Canada', code: '+1', flag: '🇨🇦' },
  { name: 'Australia', code: '+61', flag: '🇦🇺' },
  { name: 'Germany', code: '+49', flag: '🇩🇪' },
];

export const CountryCodeModal = ({ isOpen, onClose, selectedCode, onSelectCode }) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-base font-bold text-gray-900">Select Country Code</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="mt-3 flex items-center bg-gray-100 rounded-xl px-3 py-2 text-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 mr-2 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search country or code..."
            className="w-full bg-transparent focus:outline-none text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* List */}
        <div className="mt-3 space-y-1.5 overflow-y-auto flex-1 pr-1">
          {filtered.map((item) => {
            const isSelected = selectedCode === item.code;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onSelectCode(item.code);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                  isSelected ? 'bg-brand-orange/10 font-bold text-brand-orange' : 'hover:bg-gray-50 text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl">{item.flag}</span>
                  <span className="text-xs font-semibold">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-gray-500">{item.code}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-orange" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CountryCodeModal;

