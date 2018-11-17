// @ts-check
const mongoose = require('mongoose');

const SemesterSchema = new mongoose.Schema({
  number: Number,
  started: {
    type: Date,
    required: true,
    default: Date.now,
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
    documents: [
      {
        url: {
          type: String,
        },
      },
    ],
  },
  internal: [{
    number: {
      type: Number,
      enum: [1, 2, 3],
      required: true,
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
        required: true,
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
      required: true,
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
