import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Card from '../components/Card';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/bookings/my');
        if (mounted) setBookings(res.data?.data || []);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <div className="p-4">You have no bookings yet.</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Card key={b._id} className="flex justify-between items-center">
              <div>
                <div className="font-medium">{b.service}</div>
                <div className="text-sm text-gray-500">{new Date(b.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-sm">{b.status}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
