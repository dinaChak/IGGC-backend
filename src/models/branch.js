const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    trim: true
  }
});


const Branch = mongoose.model('Branch', BranchSchema);

module.exports = { Branch };