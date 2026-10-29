import React, { useState } from 'react';
import { X, Percent, Copy, Check } from 'lucide-react';

const OFFERS = [
  {
    code: 'FASTOR30',
    title: '30% OFF on Gourmet Dishes',
    desc: 'Valid on orders above ₹199 from Best Seller menu.',
    discount: '30% OFF',
    expiry: 'Expires in 2 days',
  },
  {
    code: 'FREESHIP',
    title: 'Free Express Delivery',
    desc: 'Enjoy free delivery with no minimum order value.',
    discount: 'FREE DELIVERY',
    expiry: 'Valid today only',
  },
  {
    code: 'WELCOME50',
    title: '₹50 Flat Cashback',
    desc: 'Get ₹50 credited into your Fastor Wallet on your first order.',
    discount: '₹50 BACK',
    expiry: 'New Users Only',
  },
];

export const OffersModal = ({ isOpen, onClose }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7A59] to-[#FF9E7A] flex items-center justify-center text-white">
              <Percent className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Exclusive Deals & Offers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 overflow-y-auto flex-1 pr-1">
          {OFFERS.map((offer) => (
            <div
              key={offer.code}
              className="p-4 rounded-2xl border border-dashed border-brand-orange/40 bg-orange-50/40 space-y-2 relative"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-brand-orange text-white">
                    {offer.discount}
                  </span>
                  <h4 className="mt-1.5 text-xs font-bold text-gray-900">{offer.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">{offer.desc}</p>
                </div>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="px-2.5 py-1 text-xs font-bold text-brand-orange bg-white border border-brand-orange/30 rounded-xl hover:bg-brand-orange hover:text-white transition-colors flex items-center space-x-1 shrink-0"
                >
                  {copiedCode === offer.code ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-green-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{offer.code}</span>
                    </>
                  )}
                </button>
              </div>
              <span className="text-[10px] text-gray-400 block">{offer.expiry}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OffersModal;

