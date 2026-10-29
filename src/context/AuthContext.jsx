import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('fastor_auth_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('fastor_user_data');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [pendingPhone, setPendingPhoneState] = useState(
    () => localStorage.getItem('fastor_pending_phone') || ''
  );
  const [pendingDialCode, setPendingDialCodeState] = useState(
    () => localStorage.getItem('fastor_pending_dial_code') || '+91'
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('fastor_auth_token');
    const savedUser = localStorage.getItem('fastor_user_data');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data from storage', e);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setToken(authToken);
    setUser(userData);
    localStorage.setItem('fastor_auth_token', authToken);
    localStorage.setItem('fastor_user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fastor_auth_token');
    localStorage.removeItem('fastor_user_data');
    localStorage.removeItem('fastor_pending_phone');
    localStorage.removeItem('fastor_pending_dial_code');
  };

  const setPendingAuth = (phone, dialCode = '+91') => {
    setPendingPhoneState(phone);
    setPendingDialCodeState(dialCode);
    localStorage.setItem('fastor_pending_phone', phone);
    localStorage.setItem('fastor_pending_dial_code', dialCode);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    pendingPhone,
    pendingDialCode,
    setPendingAuth,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
