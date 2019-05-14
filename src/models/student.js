// @ts-nocheck
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const StudentSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    validate: {
      validator: value => (!Number.isNaN(Number(value)) && value.length === 10),
      message: props => `${props.value} is not a valid phone number`,
    },
  },
  email: {
    type: String,
    minlength: 1,
    validate: {
      validator: isEmail,
      message: props => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    minlength: 1,
    lowercase: true,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },

  fatherName: {
    type: String,
    lowercase: true,
  },
  motherName: {
    type: String,
    lowercase: true,
  },
  address: {
    present: {
      type: String,
    },
    permanent: {
      type: String,
    },
  },
  religion: {
    type: String,
  },
  category: {
    type: String,
  },
  nationality: {
    type: String,
  },
  branch: {
    type: String,
    lowercase: true,
  },
  rollNumber: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  signatureImage: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

StudentSchema.index({ name: 'text', rollNumber: 'text' });

StudentSchema.methods.toJSON = function toJSON() {
  const student = this;
  const studentObject = student.toObject();

  return _.omit(studentObject, ['password', '__v']);
};

StudentSchema.pre('save', function hashPassword(next) {
  const student = this;

  if (student.isModified('password')) {
    bcrypt.genSalt(12, (err, salt) => {
      // eslint-disable-next-line
      bcrypt.hash(student.password, salt, (err, hash) => {
        student.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});


const Student = mongoose.model('Student', StudentSchema);

module.exports = { Student };
