import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...rest }) {
  const base = 'px-4 py-2 rounded btn-transition font-medium';
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100',
    outline: 'border border-gray-300 text-gray-900 bg-transparent',
  };
  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...rest}>
      {children}
    </button>
  );
}
