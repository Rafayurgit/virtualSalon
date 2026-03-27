import mongoose from 'mongoose';

const { Schema } = mongoose;

const barberSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  { timestamps: true }
);

const Barber = mongoose.model('Barber', barberSchema);
export default Barber;
