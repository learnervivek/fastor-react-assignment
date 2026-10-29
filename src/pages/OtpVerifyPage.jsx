import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import NumericKeypad from '../components/NumericKeypad';
import { verifyOtpAndLogin, registerUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export const OtpVerifyPage = () => {
  const navigate = useNavigate();
  const { pendingPhone, pendingDialCode, login } = useAuth();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');

  const inputRefs = useRef([]);

  const displayPhone = pendingPhone || localStorage.getItem('fastor_pending_phone') || '';
  const displayDialCode = pendingDialCode || localStorage.getItem('fastor_pending_dial_code') || '+91';

  // Guard: If no phone number is pending, redirect back to /login
  useEffect(() => {
    if (!displayPhone) {
      navigate('/login', { replace: true });
    }
  }, [displayPhone, navigate]);

  const formattedPhone = displayPhone
    ? `${displayDialCode} ${displayPhone.slice(0, 5)} ${displayPhone.slice(5)}`
    : '';

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleKeyPress = (num) => {
    const nextEmptyIndex = otp.findIndex((digit) => digit === '');
    if (nextEmptyIndex !== -1) {
      const updated = [...otp];
      updated[nextEmptyIndex] = num;
      setOtp(updated);
      setError('');
      if (nextEmptyIndex < 5) {
        inputRefs.current[nextEmptyIndex + 1]?.focus();
      }
    }
  };

  const handleDelete = () => {
    let lastFilledIndex = -1;
    for (let i = otp.length - 1; i >= 0; i--) {
      if (otp[i] !== '') {
        lastFilledIndex = i;
        break;
      }
    }
    if (lastFilledIndex !== -1) {
      const updated = [...otp];
      updated[lastFilledIndex] = '';
      setOtp(updated);
      setError('');
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  const handleInputChange = (index, value) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) return;

    if (cleanVal.length > 1) {
      const pastedDigits = cleanVal.slice(0, 6).split('');
      const updated = [...otp];
      pastedDigits.forEach((d, i) => {
        if (i < 6) updated[i] = d;
      });
      setOtp(updated);
      inputRefs.current[Math.min(pastedDigits.length, 5)]?.focus();
      return;
    }

    const updated = [...otp];
    updated[index] = cleanVal;
    setOtp(updated);
    setError('');

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const fullOtp = otp.join('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call actual Fastor staging login endpoint
      const result = await verifyOtpAndLogin(displayPhone, fullOtp, displayDialCode);

      // Verify token was extracted safely
      if (result?.token && typeof result.token === 'string') {
        // Save token and user state securely without logging the token
        login(result.user, result.token);
        // Redirect user to restaurant discovery screen
        navigate('/', { replace: true });
      } else {
        setError('Login failed: Token not returned by server.');
      }
    } catch (err) {
      console.error('Login submission failed:', err);
      // Display actual server error (e.g. "Incorrect OTP") without fabricating success
      setError(err.message || 'Authentication failed. Please verify the OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || loading) return;
    try {
      setResendSuccess('');
      setError('');
      await registerUser(displayPhone, displayDialCode);
      setResendTimer(30);
      setCanResend(false);
      setResendSuccess('New verification code sent!');
      setTimeout(() => setResendSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    }
  };

  const handleFillDemoOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6']);
    setError('');
  };

  return (
    <div className="flex flex-col min-h-screen justify-between bg-white">
      {/* Top Section */}
      <div>
        <StatusBar />

        <div className="px-6 pt-2">
          {/* Back chevron in orange */}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-brand-orange hover:opacity-80 p-1 -ml-1 transition-opacity inline-flex items-center"
            aria-label="Back to Phone Entry"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Heading & Subtitle */}
          <div className="mt-5 mb-8">
            <h1 className="text-2xl font-bold text-brand-dark tracking-tight">
              6-digit code
            </h1>
            <p className="mt-2 text-xs text-brand-gray leading-relaxed">
              Please enter the code we've sent to{' '}
              <span className="font-semibold text-brand-dark block mt-0.5">
                {formattedPhone}
              </span>
            </p>
          </div>

          {/* Error & Success Feedback Alerts */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-red-600 text-xs animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {resendSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2 text-green-700 text-xs animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resendSuccess}</span>
            </div>
          )}

          {/* 6 OTP Boxes with Hyphen separator in middle: [ ][ ][ ] - [ ][ ][ ] */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {[0, 1, 2].map((idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all outline-none ${
                  otp[idx]
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-dark'
                    : 'border-gray-200 bg-white text-brand-dark focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20'
                }`}
              />
            ))}

            <span className="text-gray-400 font-bold px-0.5 select-none">-</span>

            {[3, 4, 5].map((idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[idx]}
                onChange={(e) => handleInputChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border transition-all outline-none ${
                  otp[idx]
                    ? 'border-brand-orange bg-brand-orange/5 text-brand-dark'
                    : 'border-gray-200 bg-white text-brand-dark focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20'
                }`}
              />
            ))}
          </div>

          {/* Resend Subtext matching Figma: "I didn't receive a code (00:30)" */}
          <div className="mt-4 flex items-center justify-between text-xs">
            <div className="text-brand-gray">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-brand-orange font-semibold hover:underline"
                >
                  Resend code now
                </button>
              ) : (
                <span>
                  I didn't receive a code (
                  <span className="text-brand-orange font-semibold">
                    00:{resendTimer.toString().padStart(2, '0')}
                  </span>
                  )
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleFillDemoOtp}
              className="text-brand-orange font-semibold hover:underline"
            >
              Default OTP (123456)
            </button>
          </div>

          {/* Primary CTA Button: Continue */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || fullOtp.length < 6}
            className={`w-full mt-6 h-13 py-3.5 px-4 rounded-xl font-bold text-white text-base shadow-sm transition-all flex items-center justify-center space-x-2 ${
              fullOtp.length === 6 && !loading
                ? 'bg-brand-orange hover:bg-brand-orange-hover active:scale-[0.99]'
                : 'bg-brand-orange/50 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Continue</span>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Keypad */}
      <div className="mt-auto">
        <NumericKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default OtpVerifyPage;
