const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, default: '09:00' },
  endTime: { type: String, default: '17:00' },
  location: { type: String },
  capacity: { type: Number, default: 100 },
  category: { type: String, enum: ['Tech', 'Sports', 'Cultural', 'Academic', 'Social', 'Workshop'], default: 'Academic' },
  image: { type: String, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
