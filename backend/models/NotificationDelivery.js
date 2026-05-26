import mongoose from 'mongoose';
import crypto from 'crypto';

const notificationDeliverySchema = new mongoose.Schema({
  _id: { type: String, default: () => crypto.randomBytes(16).toString('hex') },
  notificationId: { type: String, required: true },
  subscriptionId: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'sent', 'failed'] },
  deliveredAt: { type: Date, default: null },
  errorMessage: { type: String, default: null }
}, { _id: false, id: false });

notificationDeliverySchema.set('toJSON', { virtuals: false });

const NotificationDelivery = mongoose.model('NotificationDelivery', notificationDeliverySchema);

export default NotificationDelivery;
