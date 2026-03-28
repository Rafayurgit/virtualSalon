import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import TimeSlots from '../components/TimeSlots';

const schema = yup.object({
  service: yup.string().required('Choose a service'),
  timeSlot: yup.string().required('Choose a time'),
}).required();

export default function Booking() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema), defaultValues: { service: '', timeSlot: '' } });

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

  const fetchSlots = useCallback(async (selDate) => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const res = await api.get('/slots', { params: { salonId: id, date: selDate } });
      setSlots(res.data?.data || []);
    } catch (err) {
      console.error('slots fetch error', err);
      setSlotsError(err?.message || 'Failed to load slots');
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, [id]);

  // fetch slots initially and when date changes
  useEffect(() => {
    fetchSlots(date);
    // clear selected slot when date changes
    setValue('slotId', '');
    setValue('timeSlot', '');
  }, [date, fetchSlots, setValue]);

  const onSubmit = (data) => {
    if (!user) return navigate('/login');
    // pass selection to confirmation route
    navigate(`/booking/${id}/confirm`, { state: { service: data.service, timeSlot: data.timeSlot, date } });
  };

  if (loading) return <div className="py-8"><div className="max-w-md mx-auto"><div className="p-4"><div className="h-8 w-full bg-gray-200 dark:bg-gray-700 animate-pulse"/></div></div></div>;
  if (!shop) return <div className="p-4">Salon not found</div>;

  return (
    <div>
      <h1 className="text-2xl mb-2">Book at {shop.name || shop.locationName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Card>
            <h3 className="font-semibold">Select Service</h3>
            <select {...register('service')} className="mt-2 w-full p-2 border rounded">
              <option value="">Choose</option>
              {(shop.services || ['Haircut']).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.service && <div className="text-xs text-red-500 mt-1">{errors.service.message}</div>}

            <h3 className="font-semibold mt-4">Date</h3>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

            <h3 className="font-semibold mt-4">Time</h3>
            <div className="mt-2">
              <TimeSlots
                slots={slots}
                selected={watch('slotId')}
                loading={slotsLoading}
                onSelect={(slot) => {
                  // store both slotId and time for summary and submission
                  setValue('slotId', slot.id);
                  setValue('timeSlot', slot.time);
                }}
              />
              {slotsError && <div className="text-xs text-red-500 mt-1">{slotsError}</div>}
              {errors.timeSlot && <div className="text-xs text-red-500 mt-1">{errors.timeSlot.message}</div>}
            </div>

            <div className="mt-4">
              <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || !watch('service') || !watch('slotId')}>{isSubmitting ? 'Processing...' : 'Continue to Confirm'}</Button>
            </div>
          </Card>
        </div>
        <div>
          <Card>
            <h3 className="font-semibold">Summary</h3>
            <p className="mt-2">Service: {watch('service') || '—'}</p>
            <p>Time: {watch('timeSlot') || '—'}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
