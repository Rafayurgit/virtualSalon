import React from 'react';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="py-8">
      <section className="text-center mb-8">
        <h1 className="text-3xl font-semibold">Book your salon visit</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Find nearby salons, view services and book quickly.</p>
        <div className="mt-4 flex justify-center gap-2">
          <Link to="/salons" className="px-4 py-2 bg-indigo-600 text-white rounded">Find Salons</Link>
        </div>
      </section>

      <section>
        <h2 className="text-xl mb-4">Featured</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-semibold">Quick Booking</h3>
            <p className="text-sm text-gray-500 mt-2">Fast and friendly salons near you.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}
