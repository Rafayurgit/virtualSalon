import mongoose from 'mongoose';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, enum: ['customer', 'barber', 'admin'], default: 'customer' },
  },
  { timestamps: true }
);

// Ensure indexes are created for unique fields
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

const User = mongoose.model('User', userSchema);
export default User;
