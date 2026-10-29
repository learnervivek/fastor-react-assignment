import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

export const TermsModal = ({ isOpen, onClose, title = 'Terms & Conditions' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-orange" />
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto pr-1 text-xs text-gray-600 space-y-3 leading-relaxed flex-1">
          <p>
            Welcome to Fastor! By using our platform, you agree to comply with our Terms of Service and Privacy Policy.
          </p>
          <h4 className="font-bold text-gray-900">1. Account & OTP Verification</h4>
          <p>
            You agree to provide a valid mobile number. Fastor sends an OTP to authenticate your session. Standard carrier SMS rates may apply.
          </p>
          <h4 className="font-bold text-gray-900">2. Ordering & Restaurant Availability</h4>
          <p>
            Prices, items, and portion sizes (Personal, Medium, Familiar, Jumbo) are set by participating dining partners in your designated city.
          </p>
          <h4 className="font-bold text-gray-900">3. Privacy & Data Protection</h4>
          <p>
            Your information is encrypted and used strictly for delivery logistics, order fulfillment, and session security. We do not sell your personal data.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 bg-brand-orange text-white font-bold text-sm rounded-xl hover:bg-brand-orange-hover transition-colors shadow-sm"
        >
          I Understand & Agree
        </button>
      </div>
    </div>
  );
};

export default TermsModal;

