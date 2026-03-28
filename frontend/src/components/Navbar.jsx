import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="font-bold">Virtual Salon</NavLink>
          <NavLink to="/salons" className={({isActive}) => isActive ? 'text-indigo-600' : ''}>Salons</NavLink>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <>
              <button onClick={() => navigate('/dashboard')} className="text-sm">Dashboard</button>
              <button onClick={() => { logout(); navigate('/'); }} className="text-sm">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm">Login</NavLink>
              <NavLink to="/signup" className="text-sm">Sign up</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
