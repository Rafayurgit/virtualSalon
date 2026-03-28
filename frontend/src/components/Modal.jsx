import React from 'react';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 max-w-lg w-full">
        <button className="float-right" onClick={onClose}>Close</button>
        <div className="clear-both mt-2">{children}</div>
      </div>
    </div>
  );
}
