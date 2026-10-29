import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronDown, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import NumericKeypad from '../components/NumericKeypad';
import TermsModal from '../components/modals/TermsModal';
import CountryCodeModal from '../components/modals/CountryCodeModal';
import { registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const LoginPhonePage = () => {
  const navigate = useNavigate();
  const { setPendingAuth, pendingPhone, pendingDialCode } = useAuth();

  const [phone, setPhone] = useState(pendingPhone || '');
  const [dialCode, setDialCode] = useState(pendingDialCode || '+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modals
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsTitle, setTermsTitle] = useState('Terms & Conditions');
  const [countryModalOpen, setCountryModalOpen] = useState(false);

  const handleKeyPress = (num) => {
    if (phone.length < 10) {
      setPhone((prev) => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPhone((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleInputChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(rawVal);
    setError('');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return; // Prevent duplicate submission

    // Validation
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      // Call actual Fastor staging register endpoint
      const response = await registerUser(cleanPhone, dialCode);

      // Verify server response structure
      if (response?.status === 'Success' && response?.status_code === 200) {
        setSuccessMsg('OTP sent successfully!');
        setPendingAuth(cleanPhone, dialCode);
        setTimeout(() => {
          navigate('/otp');
        }, 500);
      } else {
        setError(response?.error_message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      // Display actual server error without falsifying state
      setError(err.message || 'Unable to communicate with Fastor registration server.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setPhone('9818979450');
    setDialCode('+91');
    setError('');
  };

  const openTerms = (title) => {
    setTermsTitle(title);
    setTermsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white">
      {/* Top Section */}
      <div>
        <StatusBar />

        <div className="px-6 pt-2">
          {/* Back chevron in orange matching Figma */}
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-brand-orange hover:opacity-80 p-1 -ml-1 transition-opacity inline-flex items-center"
            aria-label="Back"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Title & Subtitle */}
          <div className="mt-5 mb-8">
            <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
              Sign Up to Fastor
            </h1>
            <p className="mt-2 text-xs text-brand-gray leading-relaxed max-w-xs">
              Let us know your mobile number and we will send you an OTP for verification.
            </p>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-red-600 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2 text-green-700 text-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mobile Number Input Container */}
          <div className="relative">
            <div className="flex items-center h-14 w-full rounded-xl border border-gray-200 bg-[#F8F9FA] px-3 transition-all focus-within:border-brand-orange focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-orange/20">
              {/* Dial Code Selector Button */}
              <button
                type="button"
                onClick={() => setCountryModalOpen(true)}
                className="text-brand-dark font-semibold text-sm sm:text-base mr-1 flex items-center select-none hover:text-brand-orange transition-colors"
                title="Change country code"
              >
                <span>{dialCode}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
                <span className="mx-2 text-brand-orange font-normal text-lg">|</span>
              </button>

              <input
                type="tel"
                value={phone}
                onChange={handleInputChange}
                placeholder="- 00000"
                maxLength={10}
                className="w-full bg-transparent font-medium text-brand-dark text-base placeholder-gray-400 focus:outline-none tracking-wide"
                autoFocus
              />
            </div>

            {/* Quick Demo Fill Helper */}
            <div className="mt-2 flex items-center justify-between text-xs text-brand-gray">
              <span>10-digit number required</span>
              <button
                type="button"
                onClick={handleUseDemo}
                className="text-brand-orange font-semibold hover:underline"
              >
                Auto-fill demo (9818979450)
              </button>
            </div>
          </div>

          {/* Primary CTA Button: Get OTP */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || phone.length < 10}
            className={`w-full mt-6 h-13 py-3.5 px-4 rounded-xl font-bold text-white text-base shadow-sm transition-all flex items-center justify-center space-x-2 ${
              phone.length === 10 && !loading
                ? 'bg-brand-orange hover:bg-brand-orange-hover active:scale-[0.99]'
                : 'bg-brand-orange/50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sending OTP...</span>
              </>
            ) : (
              <span>Get OTP</span>
            )}
          </button>

          {/* Legal / Terms disclaimer matching Figma */}
          <p className="mt-4 text-[11px] text-center text-gray-400 leading-normal">
            By clicking, I accept the{' '}
            <button
              type="button"
              onClick={() => openTerms('Terms & Conditions')}
              className="text-gray-600 font-medium hover:underline inline"
            >
              Terms & Conditions
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={() => openTerms('Privacy Policy')}
              className="text-gray-600 font-medium hover:underline inline"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Interactive Keypad matching Figma design */}
      <div className="mt-auto">
        <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
      </div>

      {/* Country Code Modal */}
      <CountryCodeModal
        isOpen={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        selectedCode={dialCode}
        onSelectCode={setDialCode}
      />

      {/* Reusable Terms Modal */}
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
        title={termsTitle}
      />
    </div>
  );
};

export default LoginPhonePage;
