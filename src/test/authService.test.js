import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '../services/apiClient';
import { registerUser, verifyOtpAndLogin, logoutUser } from '../services/authService';

vi.mock('../services/apiClient');

describe('authService Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('registerUser', () => {
    it('throws an error if phone is invalid', async () => {
      await expect(registerUser('123')).rejects.toThrow('Please enter a valid phone number');
      await expect(registerUser('abcdefghij')).rejects.toThrow('Please enter a valid phone number');
    });

    it('sends URLSearchParams with phone and dial_code', async () => {
      apiClient.post.mockResolvedValueOnce({
        data: { status: 'Success', status_code: 200, data: 'otp sent' }
      });

      const res = await registerUser('9818979450', '+91');
      expect(res.status).toBe('Success');
      expect(res.data).toBe('otp sent');

      expect(apiClient.post).toHaveBeenCalledTimes(1);
      const [url, body] = apiClient.post.mock.calls[0];
      expect(url).toBe('/pwa/user/register');
      expect(body.get('phone')).toBe('9818979450');
      expect(body.get('dial_code')).toBe('+91');
    });

    it('throws an error when API returns failure status inside 200 envelope', async () => {
      apiClient.post.mockResolvedValueOnce({
        data: {
          status: 'Failed',
          status_code: 400,
          error_message: 'Incorrect Mobile Number'
        }
      });

      await expect(registerUser('9999999999')).rejects.toThrow('Incorrect Mobile Number');
    });
  });

  describe('verifyOtpAndLogin', () => {
    it('throws error when OTP is not 6 digits', async () => {
      await expect(verifyOtpAndLogin('9818979450', '123')).rejects.toThrow('Please enter a complete 6-digit OTP');
    });

    it('successfully extracts JWT and user info on valid OTP', async () => {
      const mockToken = 'mock_jwt_token_header.payload.signature';
      apiClient.post.mockResolvedValueOnce({
        data: {
          status: 'Success',
          status_code: 200,
          data: {
            user_id: '7208',
            user_name: 'Fastor User',
            token: mockToken,
          }
        }
      });

      const result = await verifyOtpAndLogin('9818979450', '123456');
      expect(result.token).toBe(mockToken);
      expect(result.user.user_name).toBe('Fastor User');

      const [url, body] = apiClient.post.mock.calls[0];
      expect(url).toBe('/pwa/user/login');
      expect(body.get('phone')).toBe('9818979450');
      expect(body.get('otp')).toBe('123456');
    });

    it('throws error when server responds with Incorrect OTP', async () => {
      apiClient.post.mockResolvedValueOnce({
        data: {
          status: 'Failed',
          status_code: 500,
          error_message: 'Incorrect OTP'
        }
      });

      await expect(verifyOtpAndLogin('9818979450', '999999')).rejects.toThrow('Incorrect OTP');
    });
  });

  describe('logoutUser', () => {
    it('clears all authentication and phone storage', () => {
      localStorage.setItem('fastor_auth_token', 'sample_token');
      localStorage.setItem('fastor_user_data', JSON.stringify({ name: 'User' }));
      localStorage.setItem('fastor_pending_phone', '9818979450');

      logoutUser();

      expect(localStorage.getItem('fastor_auth_token')).toBeNull();
      expect(localStorage.getItem('fastor_user_data')).toBeNull();
      expect(localStorage.getItem('fastor_pending_phone')).toBeNull();
    });
  });
});

