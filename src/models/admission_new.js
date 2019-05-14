const mongoose = require('mongoose');

const AdmissionNewSchema = new mongoose.Schema({
  session: {
    from: Date,
    to: Date,
  },
  start_date: Date,
  end_date: Date,
  semester: {
    instruction: String,
    feeStructure: String,
  },
  hostel: String,
});

const AdmissionNew = mongoose.model('AdmissionNew', AdmissionNewSchema);

module.exports = { AdmissionNew };
