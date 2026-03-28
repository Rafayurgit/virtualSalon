import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

export default function SalonList() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/shops');
        if (mounted) setSalons(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="py-8"><div className="max-w-md mx-auto"><div className="p-4"><div className="h-8 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"/></div></div></div>;
  if (!loading && salons.length === 0) return <div className="p-4">No salons found.</div>;

  return (
    <div>
      <h1 className="text-2xl mb-4">Salons</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {salons.map((s) => (
          <Link key={s._id} to={`/salons/${s._id}`}>
            <Card>
              <h3 className="font-semibold">{s.name || s.locationName || 'Salon'}</h3>
              <p className="text-sm text-gray-500">{s.address || ''}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
