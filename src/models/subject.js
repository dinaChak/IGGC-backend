const { Schema, model } = require('mongoose');

const SubjectSchema = new Schema({
  title: {
    type: String,
    minlength: 1,
    required: true
  },
  branch: {
    type: String,
    require: true,
    minlength: 1,
  },
  code: {
    type: String,
    required: true,
    minlength: 1
  },
  semester: {
    type: Number,
    required: true
  }
});

const Subject = model('Subject', SubjectSchema);

module.exports = { Subject };