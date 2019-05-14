const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
  },
  description: {
    type: String,
    minlength: 20,
  },
  stream: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stream',
    required: true,
  },
});

const Department = mongoose.model('Department', DepartmentSchema);

module.exports = { Department };
