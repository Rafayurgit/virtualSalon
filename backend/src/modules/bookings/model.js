import mongoose from 'mongoose';

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    barberName: { type: String },
    service: { type: String },
    timeSlot: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
