const express = require('express');
const router = express.Router();
const regCtrl = require('../controllers/registrationController');
const { authenticated, authorize } = require('../middleware/auth');

router.post('/events/:id/register', authenticated, authorize('student'), regCtrl.registerForEvent);
router.get('/my', authenticated, regCtrl.myRegistrations);
router.delete('/:id', authenticated, regCtrl.cancelRegistration);
router.get('/events/:id', authenticated, authorize('admin'), regCtrl.eventRegistrations);
router.patch('/:id/approve', authenticated, authorize('admin'), regCtrl.approveRegistration);
router.patch('/:id/reject', authenticated, authorize('admin'), regCtrl.rejectRegistration);

module.exports = router;
