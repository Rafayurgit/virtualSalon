import mongoose from 'mongoose';

const { Schema } = mongoose;

const shopSchema = new Schema(
  {
    name: { type: String, required: true },
    locationName: { type: String },
    // GeoJSON Point: { type: 'Point', coordinates: [ lng, lat ] }
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    services: [{ type: String }],
  },
  { timestamps: true }
);

// 2dsphere index for geospatial queries
shopSchema.index({ coordinates: '2dsphere' });

const Shop = mongoose.model('Shop', shopSchema);
export default Shop;
