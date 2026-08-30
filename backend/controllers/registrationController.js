const Registration = require('../models/Registration');
const Event = require('../models/Event');

exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const exists = await Registration.findOne({ user: req.user._id, event: event._id, status: { $in: ['approved', 'pending'] } });
    if (exists) return res.status(400).json({ message: 'Already registered' });
    const reg = new Registration({ user: req.user._id, event: event._id, status: 'pending' });
    await reg.save();
    res.json(reg);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.cancelRegistration = async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (reg.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    reg.status = 'cancelled';
    await reg.save();
    res.json(reg);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.approveRegistration = async (req, res) => {
  try {
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    ).populate('user', 'name email').populate('event', 'title');
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json(reg);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.rejectRegistration = async (req, res) => {
  try {
    const { reason } = req.body;
    const reg = await Registration.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'No reason provided' },
      { new: true }
    ).populate('user', 'name email').populate('event', 'title');
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    res.json(reg);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.myRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id }).populate('event');
    res.json(regs);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

exports.eventRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.id }).populate('user', 'name email');
    res.json(regs);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};
