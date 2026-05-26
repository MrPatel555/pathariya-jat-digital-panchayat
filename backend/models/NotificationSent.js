import mongoose from 'mongoose';
import crypto from 'crypto';

const notificationSentSchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomBytes(16).toString('hex') },
  title: { type: String, required: true },
  message: { type: String, required: true },
  imageUrl: { type: String, default: null },
  sentAt: { type: Date, default: Date.now },
  totalSubscribers: { type: Number, default: 0 },
  successfulSends: { type: Number, default: 0 },
  failedSends: { type: Number, default: 0 }
}, { _id: false, id: false });

notificationSentSchema.set('toJSON', { virtuals: false });

const NotificationSent = mongoose.model('NotificationSent', notificationSentSchema);

export default NotificationSent;
