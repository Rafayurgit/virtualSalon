import mongoose from 'mongoose';

const { Schema } = mongoose;

const queueSchema = new Schema(
  {
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    currentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Queue = mongoose.model('Queue', queueSchema);
export default Queue;
