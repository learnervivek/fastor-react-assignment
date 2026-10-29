import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const REASONS = [
  'Changed my mind',
  'Ordered by mistake',
  'Delivery time is too long',
  'Need to change delivery address',
];

export const CancelOrderModal = ({ isOpen, onClose, orderItem, onConfirmCancel }) => {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Cancel Order</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-3 text-xs text-gray-600">
          Are you sure you want to cancel your order for{' '}
          <span className="font-bold text-gray-900">{orderItem?.name || 'this item'}</span>?
        </p>

        <div className="mt-4 space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Please select a cancellation reason:
          </span>
          {REASONS.map((reason) => (
            <label
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`flex items-center space-x-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                selectedReason === reason
                  ? 'border-brand-orange bg-brand-orange/5 font-semibold text-gray-900'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name="cancelReason"
                checked={selectedReason === reason}
                onChange={() => setSelectedReason(reason)}
                className="text-brand-orange focus:ring-brand-orange"
              />
              <span>{reason}</span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex items-center space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Keep Order
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmCancel(orderItem?.id);
              onClose();
            }}
            className="flex-1 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-xs"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;

