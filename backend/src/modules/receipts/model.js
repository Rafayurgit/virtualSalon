import mongoose from 'mongoose';

const { Schema } = mongoose;

const receiptSchema = new Schema(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    amount: { type: Number },
    currency: { type: String, default: 'INR' },
    items: { type: Array },
  },
  { timestamps: true }
);

const Receipt = mongoose.model('Receipt', receiptSchema);
export default Receipt;
