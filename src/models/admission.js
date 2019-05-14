// @ts-check
const mongoose = require('mongoose');

const AdmissionSchema = new mongoose.Schema({
  semesterType: {
    type: String,
    enum: ['even', 'odd'],
  },
  openingDate: {
    type: Date,
    required: true,
  },
  closingDate: {
    type: Date,
    required: true,
  },
  branches: [{
    title: String,
    semesterFees: [{
      semester: Number,
      fees: Number,
    }],
  }],
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

AdmissionSchema
  .virtual('closed')
  .get(function closed() {
    return new Date().getTime() > new Date(this.closingDate).getTime();
  });

const Admission = mongoose.model('Admission', AdmissionSchema);

module.exports = {
  Admission,
};
