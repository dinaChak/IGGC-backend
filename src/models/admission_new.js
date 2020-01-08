const mongoose = require('mongoose');

const AdmissionNewSchema = new mongoose.Schema({
  session: {
    from: Date,
    to: Date,
  },
  semesters: [Number],
  start_date: Date,
  end_date: Date,
  instruction: String,
  feeStructure: String,
  hostel: String,
});

const AdmissionNew = mongoose.model('AdmissionNew', AdmissionNewSchema);

module.exports = { AdmissionNew };
