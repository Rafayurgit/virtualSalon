import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export default function BookingConfirm() {
  const { id } = useParams(); // shop id
  const { state } = useLocation();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // expecting state: { service, slot: { id, time }, date }
    if (!state || !state.service || !state.slot || !state.slot.id) {
      // incomplete flow - redirect back
      navigate(`/booking/${id}`);
    }
  }, [state, id, navigate]);

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const payload = { shopId: id, service: state.service, slotId: state.slot.id, date: state.date };
      // backend will use token to identify user; userId optional
      const res = await api.post('/bookings', payload);
      if (res && res.data && res.data.success) {
        toast.success('Booking created');
        // refetch slots for this salon and date (best-effort)
        try { await api.get('/slots', { params: { salonId: id, date: state.date } }); } catch (e) { /* ignore */ }
        navigate('/dashboard');
      } else {
        const msg = res?.data?.message || 'Booking failed';
        toast.error(msg);
        setSubmitting(false);
      }
    } catch (err) {
      toast.error(err?.message || 'Booking failed');
      setSubmitting(false);
    }
  };

  if (!state) return <Loader />;

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-semibold">Confirm Booking</h2>
        <div className="mt-4">
          <div><strong>Service:</strong> {state.service}</div>
          <div className="mt-1"><strong>Time:</strong> {state.slot?.time}</div>
          <div className="mt-1"><strong>Date:</strong> {state.date}</div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={handleConfirm} disabled={submitting || !state.slot}>{submitting ? 'Booking...' : 'Confirm'}</Button>
          <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
        </div>
      </Card>
    </div>
  );
}
