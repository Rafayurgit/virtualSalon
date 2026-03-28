export const generateSlots = ({ startHour = 9, endHour = 21, intervalMinutes = 60 } = {}) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    const time = `${String(h).padStart(2, '0')}:00`;
    slots.push({ id: time, time, available: true });
  }
  return slots;
};

export const isValidSlotId = (slotId) => {
  return typeof slotId === 'string' && /^\d{2}:\d{2}$/.test(slotId);
};
