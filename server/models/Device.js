const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true, enum: ['laptop', 'phone', 'component'] },
  manufacturer: { type: String, required: true },
  model: { type: String, required: true },
  specs: { type: String, default: '' },
  condition: { type: String, enum: ['excellent', 'good', 'fair'], default: 'good' },
  buyPrice: { type: Number, required: true, min: 0 },
  sellPrice: { type: Number, required: true, min: 0 },
  receiveDate: { type: Date, default: Date.now },
  serialNumber: { type: String, unique: true, sparse: true },
  status: { type: String, enum: ['available', 'reserved', 'sold'], default: 'available' },
  warranty: { type: String, default: '' },
  sellDate: Date,
  customer: {
    name: String,
    email: String,
    phone: String
  }
}, { timestamps: true });

deviceSchema.index({ status: 1 });
deviceSchema.index({ receiveDate: -1 });
deviceSchema.index({ user: 1 });

module.exports = mongoose.model('Device', deviceSchema);