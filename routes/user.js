const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');

router.post('/assign', auth, async (req, res) => {
  const { assignmentId, studentId } = req.body;
  try {
    const assignment = await Assignment.findByIdAndUpdate(assignmentId, { assignedTo: studentId }, { new: true });
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    await Notification.create({
      userId: studentId,
      message: `Assigned to Assignment ${assignmentId}`,
    });

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/notifications/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notification) return res.status(404).json({ msg: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;