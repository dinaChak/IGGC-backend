const mongoose = require('mongoose');

const StudentInstanceSchema = new mongoose.Schema({
  fees: {
    type: String,
    enum: ['paid', 'due'],
    default: 'due',
  },
  newRegistration: {
    type: Boolean,
    default: true,
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'processing', 'unverified', 'rejected'],
    default: 'unverified',
  },
  documentImage: String,
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  appliedOn: {
    type: Date,
    default: Date.now,
  },
});

const StudentInstance = mongoose.model('StudentInstance', StudentInstanceSchema);

module.exports = { StudentInstance };
