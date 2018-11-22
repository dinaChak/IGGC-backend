// @ts-nocheck
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const StudentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    unique: true,
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
    required: true,
    minlength: 1,
  },
  dateOfBirth: {
    type: Date,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  phoneNumber: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  addresses: {
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
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
  registrationCompleted: {
    type: Boolean,
    default: false,
  },
});

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
