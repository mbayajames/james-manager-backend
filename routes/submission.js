const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Submission = require('../models/Submission');
const Notification = require('../models/Notification');

router.post('/', auth, async (req, res) => {
  const { assignmentId, content, comments } = req.body;
  try {
    const submission = new Submission({
      assignmentId,
      studentId: req.user.id,
      content,
      comments,
      status: 'Submitted',
    });
    await submission.save();

    await Notification.create({
      userId: req.user.id,
      message: `New submission for Assignment ${assignmentId}`,
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { marks, result, feedback } = req.body;
  try {
    const submission = await Submission.findByIdAndUpdate(req.params.id, { marks, result, status: 'Graded', feedback }, { new: true });
    if (!submission) return res.status(404).json({ msg: 'Submission not found' });

    await Notification.create({
      userId: submission.studentId,
      message: `Submission ${req.params.id} graded: ${result}`,
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const submissions = await Submission.find().populate('assignmentId', 'title').populate('studentId', 'username');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;