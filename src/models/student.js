const mongoose = require('mongoose')
const { isEmail }  = require('validator');

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: isEmail,
      message: '{value} is not a valid email'
    }
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  name: {
    type: String,
    trim: true,
    required: true,
    minlength: 1,
  },
  dataOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  phoneNumber: {
    type: Number,
    minlength: 10,
    maxlength: 10,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String
  },
  profileImage: {
    type: String
  },
  fees: {
    
  },

  created: {
    type: Date,
    default: Date.now()
  }
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = { Student };