import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import SalonList from '../pages/SalonList';
import SalonDetails from '../pages/SalonDetails';
import Booking from '../pages/Booking';
import BookingConfirm from '../pages/BookingConfirm';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../hooks/useAuth';

const Protected = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/salons" element={<SalonList />} />
      <Route path="/salons/:id" element={<SalonDetails />} />
      <Route path="/booking/:id" element={<Protected><Booking /></Protected>} />
      <Route path="/booking/:id/confirm" element={<Protected><BookingConfirm /></Protected>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    </Routes>
  );
}
