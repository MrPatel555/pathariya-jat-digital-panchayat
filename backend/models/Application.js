import mongoose from 'mongoose';
import crypto from 'crypto';

const applicationSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomBytes(16).toString('hex') },
  type: { type: String, required: true },
  name: { type: String, required: true },
  mobile: { type: String, default: null },
  ward: { type: String, default: null },
  category: { type: String, default: null },
  date: { type: String, default: null },
  time: { type: String, default: null },
  status: { type: String, default: 'Pending' },
  description: { type: String, required: true },
  note: { type: String, default: '' },
  locationLat: { type: Number, default: null },
  locationLng: { type: Number, default: null },
  locationAddress: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
}, { _id: false, id: false });

applicationSchema.set('toJSON', { virtuals: false });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
