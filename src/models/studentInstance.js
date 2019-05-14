const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['eligible', 'ineligible', 'admission_initiated', 'verification_document', 'verification', 'verified', 'rejected', 'completed'],
  },
  rejection_reasons: {
    type: String,
  },
  applying: {
    type: Boolean,
  },
  semester: Number,
  documentImage: String,
  payment: {
    status: {
      type: String,
      enum: ['paid', 'due'],
      default: 'due',
    },
    amount: Number,
  },
});

const StudentInstanceSchema = new mongoose.Schema({
  newRegistration: {
    type: Boolean,
    default: true,
  },
  semester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Semester',
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  name: {
    type: String,
    trim: true,
    minlength: 1,
    lowercase: true,
  },
  branch: {
    type: String,
    lowercase: true,
  },
  rollNumber: {
    type: String,
  },
  current_semester: {
    type: Number,
  },
  admission: AdmissionSchema,
});

StudentInstanceSchema.index({ name: 'text', branch: 'text', rollNumber: 'text' });

const StudentInstance = mongoose.model('StudentInstance', StudentInstanceSchema);

module.exports = { StudentInstance };
