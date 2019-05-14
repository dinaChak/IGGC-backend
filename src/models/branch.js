// @ts-check
const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    lowercase: true,
    unique: true,
  },
});


const Branch = mongoose.model('Branch', BranchSchema);

module.exports = { Branch };
