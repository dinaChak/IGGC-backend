// @ts-check
const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  number: {
    type: Number,
  },
  fees: {
    type: String,
    enum: ['paid', 'due'],
    default: 'due',
  },
  verification: {
    status: {
      type: String,
      enum: ['verified', 'processing', 'unverified'],
      default: 'unverified',
    },
    documentImage: String,
  },
  internal: [{
    number: {
      type: Number,
      enum: [1, 2, 3],
    },
    performance: [{
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      max: {
        type: Number,
        default: 20,
      },
      mark: Number,
      result: {
        type: String,
        enum: ['pass', 'fail', 'absent'],
      },
    }],

  }],
  external: {
    performance: [{
      subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
      },
      max: {
        type: Number,
        default: 80,
      },
      mark: Number,
    }],
    result: {
      type: String,
    },
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
});

const Semester = mongoose.model('Semester', SemesterSchema);

module.exports = {
  Semester,
};
