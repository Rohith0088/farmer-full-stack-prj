import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { BlendyProvider } from './context/BlendyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import FarmerProfile from './pages/FarmerProfile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Invoice from './pages/Invoice';
import Orders from './pages/Orders';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FarmerDashboard from './pages/FarmerDashboard';
import Notifications from './pages/Notifications';
import './App.css';

/* ---------- Protected Route wrapper ---------- */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="auth-spinner" style={{ width: 32, height: 32 }} />
      </div>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CartProvider>
          <BlendyProvider>
          <div className="app-container">
            <Header />
            <main className="app-main">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/farmer/:id" element={<FarmerProfile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />

                {/* Protected routes */}
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                <Route path="/invoice/:orderId" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/farmer-dashboard" element={<ProtectedRoute><FarmerDashboard /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              </Routes>
            </main>
            <BottomNav />
          </div>
          </BlendyProvider>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
