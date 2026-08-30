const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.createEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const ev = new Event({ ...req.body, createdBy: req.user._id });
    await ev.save();
    res.json(ev);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.updateEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.deleteEvent = async (req, res) => {
  try {
    const ev = await Event.findByIdAndDelete(req.params.id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    await Registration.deleteMany({ event: ev._id });
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.getEvent = async (req, res) => {
  try {
    const ev = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json(ev);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.listEvents = async (req, res) => {
  try {
    const { q, date, location, category } = req.query;
    const filter = {};
    if (q) filter.title = { $regex: q, $options: 'i' };
    if (date) filter.date = { $gte: new Date(date) };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (category) filter.category = category;
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.eventStats = async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$event', registrations: { $sum: 1 } } },
      { $lookup: { from: 'events', localField: '_id', foreignField: '_id', as: 'event' } },
      { $unwind: '$event' },
      { $project: { eventId: '$_id', title: '$event.title', registrations: 1 } }
    ]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.eventRegistrationStats = async (req, res) => {
  try {
    const eventId = new mongoose.Types.ObjectId(req.params.id);
    const stats = await Registration.aggregate([
      { $match: { event: eventId } },
      { $group: { 
          _id: '$status', 
          count: { $sum: 1 }
        } 
      }
    ]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
