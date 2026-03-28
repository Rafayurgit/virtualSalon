import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email required'),
  password: yup.string().required('Password required'),
}).required();

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/auth/login', data);
      const token = res.data?.data?.token;
      if (token) {
        login(token);
        toast.success('Welcome back');
        navigate('/dashboard');
      }
    } catch (err) {
      const message = err?.message || err?.error || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging...' : 'Login'}</Button>
      </form>
    </div>
  );
}
