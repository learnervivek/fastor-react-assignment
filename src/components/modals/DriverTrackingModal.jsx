import React from 'react';
import { X, Navigation, Phone, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const DriverTrackingModal = ({ isOpen, onClose, orderItem }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-brand-coral-light flex items-center justify-center text-brand-coral">
              <Navigation className="w-4 h-4 fill-brand-coral" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Live Order Tracker</h3>
              <p className="text-[11px] text-gray-400">
                {orderItem?.name || 'Order'} • Delivery to Model Town
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ETA & Map Simulation Card */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-brand-orange text-white shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-[11px] font-medium text-white/80 uppercase tracking-wider flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 mr-1" /> Estimated Arrival
              </span>
              <h4 className="text-2xl font-black mt-1">12 - 15 mins</h4>
              <p className="text-xs text-white/90 mt-0.5">Driver is 1.4 km away from your location</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xs rounded-2xl flex items-center justify-center text-3xl">
              🛵
            </div>
          </div>
        </div>

        {/* Driver Details Card */}
        <div className="mt-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
              alt="Delivery Driver"
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h5 className="text-xs font-bold text-gray-900">Rajesh Verma</h5>
                <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 py-0.2 rounded-full">
                  ★ 4.9
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mt-0.5">Fastor Express Pilot • Vaccinated</p>
            </div>
          </div>

          <a
            href="tel:+919818979450"
            className="w-9 h-9 rounded-full bg-brand-coral text-white flex items-center justify-center shadow-xs hover:opacity-90 active:scale-95 transition-all"
            aria-label="Call Driver"
          >
            <Phone className="w-4 h-4 fill-white" />
          </a>
        </div>

        {/* Progress Timeline */}
        <div className="mt-5 space-y-3.5 flex-1 overflow-y-auto px-1">
          <div className="flex items-start space-x-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Order Confirmed</p>
              <p className="text-[10px] text-gray-400">Kitchen accepted your order</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-gray-900">Order Prepared & Packed</p>
              <p className="text-[10px] text-gray-400">Freshly made with tamper-proof seal</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 text-xs">
            <div className="w-4 h-4 rounded-full border-2 border-brand-orange flex items-center justify-center mt-0.5 shrink-0">
              <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            </div>
            <div>
              <p className="font-bold text-brand-orange">Out for Delivery</p>
              <p className="text-[10px] text-gray-400">Rajesh is on his way with your meal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverTrackingModal;

