const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const eventCtrl = require('../controllers/eventController');
const { authenticated, authorize } = require('../middleware/auth');

router.get('/', eventCtrl.listEvents);
router.get('/stats', authenticated, authorize('admin'), eventCtrl.eventStats);
router.get('/stats/:id', authenticated, authorize('admin'), eventCtrl.eventRegistrationStats);
router.get('/:id', eventCtrl.getEvent);
router.post('/', authenticated, authorize('admin'), [body('title').notEmpty(), body('date').notEmpty()], eventCtrl.createEvent);
router.put('/:id', authenticated, authorize('admin'), eventCtrl.updateEvent);
router.delete('/:id', authenticated, authorize('admin'), eventCtrl.deleteEvent);

module.exports = router;
