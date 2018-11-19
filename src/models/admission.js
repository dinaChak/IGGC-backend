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
  semester: {
    type: String,
    enum: ['even', 'odd'],
    required: true,
  },
});

const Admission = mongoose.model('Admission', AdmissionSchema);

module.exports = { Admission };
