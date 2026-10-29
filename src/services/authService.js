import apiClient from './apiClient';

const DEFAULT_DIAL_CODE = import.meta.env.VITE_DEFAULT_DIAL_CODE || '+91';

/**
 * Register mobile number and request OTP
 * Sends exact form-urlencoded payload to Fastor staging API
 *
 * @param {string} phone 10-digit mobile number
 * @param {string} dialCode Country calling code (e.g. +91)
 * @returns {Promise<{ status: string, status_code: number, data: string }>}
 */
export const registerUser = async (phone, dialCode = DEFAULT_DIAL_CODE) => {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (!cleanPhone || cleanPhone.length < 7 || cleanPhone.length > 15) {
    throw new Error('Please enter a valid phone number');
  }

  const cleanDialCode = dialCode.trim().startsWith('+') ? dialCode.trim() : `+${dialCode.trim()}`;

  const params = new URLSearchParams();
  params.append('phone', cleanPhone);
  params.append('dial_code', cleanDialCode);

  let response;
  try {
    response = await apiClient.post('/pwa/user/register', params);
  } catch (err) {
    throw new Error(err.friendlyMessage || err.message || 'Unable to connect to registration server.');
  }

  const payload = response.data;
  if (!payload || payload.status !== 'Success' || payload.status_code !== 200) {
    const errorMsg =
      payload?.error_message ||
      payload?.message ||
      (Array.isArray(payload?.error) && payload.error[0]?.error) ||
      'Failed to send OTP. Please check your phone number and try again.';
    throw new Error(errorMsg);
  }

  if (typeof payload.data === 'string' && !payload.data.toLowerCase().includes('otp')) {
    throw new Error('Did not receive OTP confirmation from server.');
  }

  return payload;
};

/**
 * Verify OTP and login user
 * Sends exact form-urlencoded payload and extracts JWT token
 *
 * @param {string} phone 10-digit mobile number
 * @param {string} otp 6-digit OTP
 * @param {string} dialCode Country calling code
 * @returns {Promise<{ token: string, user: object }>}
 */
export const verifyOtpAndLogin = async (phone, otp, dialCode = DEFAULT_DIAL_CODE) => {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  const cleanOtp = otp.trim().replace(/\D/g, '');
  const cleanDialCode = dialCode.trim().startsWith('+') ? dialCode.trim() : `+${dialCode.trim()}`;

  if (cleanOtp.length !== 6) {
    throw new Error('Please enter a complete 6-digit OTP');
  }

  const params = new URLSearchParams();
  params.append('phone', cleanPhone);
  params.append('otp', cleanOtp);
  params.append('dial_code', cleanDialCode);

  let response;
  try {
    response = await apiClient.post('/pwa/user/login', params);
  } catch (err) {
    throw new Error(err.friendlyMessage || err.message || 'Unable to communicate with login server.');
  }

  const payload = response.data;

  if (!payload || payload.status !== 'Success' || payload.status_code !== 200) {
    const errorMsg =
      payload?.error_message ||
      payload?.message ||
      'Invalid or expired OTP. Please verify and try again.';
    throw new Error(errorMsg);
  }

  const userData = payload.data || {};
  const token = userData.token || payload.token;

  if (!token || typeof token !== 'string') {
    throw new Error('Authentication succeeded but server did not return a valid session token.');
  }

  return {
    token,
    user: userData,
  };
};

/**
 * Clean up stored authentication state upon logout
 */
export const logoutUser = () => {
  localStorage.removeItem('fastor_auth_token');
  localStorage.removeItem('fastor_user_data');
  localStorage.removeItem('fastor_pending_phone');
  localStorage.removeItem('fastor_pending_dial_code');
};
