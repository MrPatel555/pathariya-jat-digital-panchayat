import mongoose from 'mongoose';
import crypto from 'crypto';

const subscriptionSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomBytes(16).toString('hex') },
  endpoint: { type: String, required: true, unique: true },
  auth: { type: String, required: true },
  p256dh: { type: String, required: true },
  clientId: { type: String, default: null },
  deviceName: { type: String, default: 'Desktop' },
  browserName: { type: String, default: 'Unknown' },
  userAgent: { type: String },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { _id: false, id: false });

// Set the primary key to the custom _id field
subscriptionSchema.set('toJSON', { virtuals: false });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
