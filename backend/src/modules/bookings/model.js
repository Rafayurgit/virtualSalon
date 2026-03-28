import mongoose from 'mongoose';

const { Schema } = mongoose;

// Booking model stores a selected slot (slotId) and date (YYYY-MM-DD)
const bookingSchema = new Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    service: { type: String, required: true },
    slotId: { type: String, required: true }, // using string id for slot (e.g. '09:00')
    date: { type: String, required: true }, // store date as YYYY-MM-DD for simplicity
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'confirmed' },
    payment: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
);

bookingSchema.index({ shopId: 1, date: 1, slotId: 1 }, { unique: false });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
