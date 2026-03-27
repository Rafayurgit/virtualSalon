import mongoose from 'mongoose';

const { Schema } = mongoose;

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    services: [{ type: String }],
  },
  { timestamps: true }
);

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
