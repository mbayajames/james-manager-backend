const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  comments: { type: String },
  status: { type: String, enum: ['Pending', 'Submitted', 'Graded'], default: 'Pending' },
  marks: { type: Number },
  result: { type: String, enum: ['Pass', 'Fail'] },
  feedback: { type: String },
});

module.exports = mongoose.model('Submission', submissionSchema);