import React, { useState } from 'react';
import {
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PlusCircle,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const TRANSACTIONS = [
  { id: 'tx1', title: 'Order #FST-8902', date: '29 Oct, 03:15 pm', amount: -24.0, type: 'debit' },
  { id: 'tx2', title: 'Fastor Cashback Added', date: '28 Oct, 11:30 am', amount: +50.0, type: 'credit' },
  { id: 'tx3', title: 'Top-up via UPI', date: '25 Oct, 08:20 pm', amount: +250.0, type: 'credit' },
];

export const WalletModal = ({ isOpen, onClose }) => {
  const { cartCount, cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + (item.basePrice + (item.extraPrice || 0)) * item.quantity,
    0
  );

  const handleCheckout = () => {
    setCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setCheckoutSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5E9EFF] to-[#7BB3FF] flex items-center justify-center text-white">
              {cartCount > 0 ? <ShoppingBag className="w-4 h-4" /> : <Wallet className="w-4 h-4" />}
            </div>
            <h3 className="text-base font-bold text-gray-900">
              {cartCount > 0 ? 'Your Food Basket & Wallet' : 'Fastor Wallet'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checkout Success Feedback */}
        {checkoutSuccess ? (
          <div className="my-8 text-center space-y-3 animate-fadeIn">
            <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-gray-900">Order Placed Successfully!</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Your order has been received by the kitchen. A Fastor driver is heading to pick it up.
            </p>
          </div>
        ) : (
          <>
            {/* Balance Card */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-md">
              <span className="text-[11px] font-medium text-gray-300">Total Available Balance</span>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-2xl font-black tracking-tight">₹276.00</span>
                <button
                  type="button"
                  onClick={() => alert('Top-up via UPI or Card is active for staging accounts.')}
                  className="text-xs font-bold text-brand-orange flex items-center space-x-1 hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Add Money</span>
                </button>
              </div>
            </div>

            {/* Active Cart Section */}
            {cartCount > 0 ? (
              <div className="mt-4 flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Basket Items ({cartCount})
                  </h4>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-semibold text-red-500 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 max-h-48">
                  {cartItems.map((item, idx) => {
                    const itemUnitPrice = item.basePrice + (item.extraPrice || 0);
                    return (
                      <div
                        key={`${item.id}-${item.portion}-${idx}`}
                        className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between"
                      >
                        <div className="flex-1 min-w-0 mr-2">
                          <h5 className="text-xs font-bold text-gray-900 truncate">
                            {item.restaurantName || 'Delicious Dish'}
                          </h5>
                          <p className="text-[10px] text-gray-500">
                            {item.portion} • ₹{itemUnitPrice.toFixed(2)} each
                          </p>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.portion, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-100 active:scale-90"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 w-3 text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.portion, 1)}
                            className="w-6 h-6 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-xs active:scale-90"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.portion)}
                            className="ml-1 p-1 text-gray-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Checkout Row */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs text-gray-500 font-medium">To Pay:</span>
                    <span className="text-base font-black text-brand-dark">
                      ₹{cartTotal.toFixed(2)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.99]"
                  >
                    Pay with Wallet • Instant Delivery
                  </button>
                </div>
              </div>
            ) : (
              /* Recent Activity when basket is empty */
              <div className="mt-5 flex-1 overflow-y-auto">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Recent Wallet History
                </h4>
                <div className="space-y-2.5">
                  {TRANSACTIONS.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center ${
                            tx.type === 'credit'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tx.type === 'credit' ? (
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-gray-800">{tx.title}</h5>
                          <p className="text-[10px] text-gray-400">{tx.date}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          tx.type === 'credit' ? 'text-green-600' : 'text-gray-900'
                        }`}
                      >
                        {tx.amount > 0 ? `+₹${tx.amount.toFixed(2)}` : `-₹${Math.abs(tx.amount).toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
