import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://staging.fastor.ai/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  timeout: 15000,
});

// Request interceptor to attach bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fastor_auth_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Diagnose CORS, network errors, 401/403, and server envelope failures separately
apiClient.interceptors.response.use(
  (response) => {
    // Fastor API often sends HTTP 200 with an internal status_code
    const payload = response.data;
    if (payload && typeof payload === 'object') {
      if (
        payload.status_code === 401 ||
        payload.error_message?.toLowerCase()?.includes('unauthorized') ||
        payload.error_message?.toLowerCase()?.includes('jwt token required')
      ) {
        localStorage.removeItem('fastor_auth_token');
        localStorage.removeItem('fastor_user_data');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/otp') {
          window.location.href = '/login';
        }
      }
    }
    return response;
  },
  (error) => {
    let diagnosedMessage = 'An unexpected error occurred. Please try again.';

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      diagnosedMessage = 'Request timed out. Please check your network connection and retry.';
    } else if (error.code === 'ERR_NETWORK' || !error.response) {
      diagnosedMessage =
        'Network error or CORS failure. Unable to establish connection to Fastor staging server.';
    } else if (error.response) {
      const status = error.response.status;
      if (status === 401) {
        diagnosedMessage = 'Session expired or invalid authentication token. Redirecting to login.';
        localStorage.removeItem('fastor_auth_token');
        localStorage.removeItem('fastor_user_data');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/otp') {
          window.location.href = '/login';
        }
      } else if (status === 403) {
        diagnosedMessage = 'Access forbidden (403): You do not have permission to access this resource.';
      } else if (status === 404) {
        diagnosedMessage = 'Requested resource not found on server (404).';
      } else if (status >= 500) {
        diagnosedMessage = 'Fastor staging server encountered an error (500). Please try again later.';
      } else {
        diagnosedMessage =
          error.response.data?.error_message ||
          error.response.data?.message ||
          `Request failed with status ${status}`;
      }
    }

    error.friendlyMessage = diagnosedMessage;
    return Promise.reject(error);
  }
);

export default apiClient;
