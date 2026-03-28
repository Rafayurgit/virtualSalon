import React from 'react';

// slots: [{time: '09:00', available: true}, ...]
// slots: [{ id, time, available }]
export default function TimeSlots({ slots = [], selected, onSelect, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return <div className="text-sm text-gray-500">No slots available</div>;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {slots.map((s) => {
        const isSelected = selected === s.id;
        return (
          <button
            key={s.id}
            type="button"
            disabled={!s.available}
            onClick={() => s.available && onSelect(s)}
            className={`p-2 rounded text-center transition-colors ${!s.available ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' : isSelected ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-gray-700'}`}
          >
            {s.time}
          </button>
        );
      })}
    </div>
  );
}
