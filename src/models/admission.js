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
  semester: {
    type: String,
    enum: ['even', 'odd'],
    required: true,
  },
});

const Admission = mongoose.model('Admission', AdmissionSchema);

module.exports = {
  Admission,
};
