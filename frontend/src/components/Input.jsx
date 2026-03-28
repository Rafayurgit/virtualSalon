import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-sm mb-1">{label}</label>}
      <input
        className={`px-3 py-2 rounded border focus:outline-none focus:ring ${error ? 'border-red-500 ring-red-200' : 'border-gray-300'} bg-white dark:bg-gray-800`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}
