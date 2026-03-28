import React from 'react';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />
      <main className="container mx-auto p-4">
        <AppRoutes />
      </main>
    </div>
  );
}
