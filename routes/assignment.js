const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');
const Notification = require('../models/Notification');

router.post('/', auth, async (req, res) => {
  const { title, description, dueDate, assignedTo } = req.body;
  try {
    const assignment = new Assignment({
      title,
      description,
      dueDate,
      published: false,
      createdBy: req.user.id,
      assignedTo,
    });
    await assignment.save();

    if (!assignment.published) {
      await new Notification({
        userId: req.user.id,
        message: `New draft assignment: ${title}`,
      }).save();
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.user.id }).populate('assignedTo', 'username');
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { title, description, dueDate, published } = req.body;
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, { title, description, dueDate, published }, { new: true });
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    await new Notification({
      userId: req.user.id,
      message: `Assignment ${req.params.id} updated`,
    }).save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ msg: 'Assignment not found' });

    await Notification.create({
      userId: req.user.id,
      message: `Assignment ${req.params.id} deleted`,
    });

    res.json({ msg: 'Assignment deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;