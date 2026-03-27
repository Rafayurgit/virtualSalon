import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['customer', 'barber'], default: 'customer' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
