const mongoose = require('mongoose')
const { isEmail }  = require('validator');
const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email`
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
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  phoneNumber: {
    type: String,
    minlength: 10,
    maxlength: 10,
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  rollNumber: {
    type: String
  },
  profileImage: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

StudentSchema.pre('save', function(next) {
  const student = this;

  if (student.isModified('password')) {
    bcrypt.genSalt(12, (err, salt) => {
      bcrypt.hash(student.password, salt, (err, hash) => {
        student.password = hash;
        next()
      });
    });
  } else {
    next();
  }
});

const Student = mongoose.model('Student', StudentSchema);

module.exports = { Student };