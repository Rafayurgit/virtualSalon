import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Card from '../components/Card';

export default function SalonDetails() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get(`/shops/${id}`);
        if (mounted) setShop(res.data?.data || null);
      } catch (err) {
        console.error(err);
      } finally { if (mounted) setLoading(false); }
    })();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!shop) return <div>Not found</div>;

  return (
    <div>
      <h1 className="text-2xl mb-2">{shop.name || shop.locationName}</h1>
      <p className="text-sm text-gray-500 mb-4">{shop.address || ''}</p>
      <Card>
        <h3 className="font-semibold">Services</h3>
        <div className="mt-2">
          {(shop.services || ['Haircut', 'Shave']).map((s) => (
            <div key={s} className="flex justify-between py-2 border-b">
              <div>{s}</div>
              <div className="text-sm">From ₹199</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link to={`/booking/${shop._id}`} className="px-3 py-2 bg-indigo-600 text-white rounded">Book Now</Link>
        </div>
      </Card>
    </div>
  );
}
