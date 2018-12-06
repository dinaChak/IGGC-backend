// @ts-check
const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  openingDate: {
    type: Date,
    required: true,
  },
  closingDate: {
    type: Date,
    required: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
  },
  updated: {
    type: Date,
    default: Date.now(),
  },
  openFor: [{
    semesters: [{
      type: Number,
      enum: [1, 2, 3, 4, 5, 6],
    }],
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Branch',
    },
    fee: {
      type: Number,
    },
  }],
});

const Admission = mongoose.model('Admission', AdmissionSchema);

module.exports = {
  Admission,
};
