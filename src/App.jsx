import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/ProtectedRoute';

import LoginPhonePage from './pages/LoginPhonePage';
import OtpVerifyPage from './pages/OtpVerifyPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';

export function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center sm:py-6">
          <main className="app-container shadow-2xl">
            <BrowserRouter>
              <Routes>
                {/* Public Only Auth Routes */}
                <Route
                  path="/login"
                  element={
                    <PublicOnlyRoute>
                      <LoginPhonePage />
                    </PublicOnlyRoute>
                  }
                />
                <Route
                  path="/otp"
                  element={
                    <PublicOnlyRoute>
                      <OtpVerifyPage />
                    </PublicOnlyRoute>
                  }
                />

                {/* Protected App Routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/restaurant/:id"
                  element={
                    <ProtectedRoute>
                      <RestaurantDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

