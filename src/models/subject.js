const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 1,
    required: true
  },
  code: {
    type: String,
    required: true,
    minlength: 1
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  semester: {
    type: Number,
    enum: [1,2,3,4,5,6]
  }
});

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = { Subject };