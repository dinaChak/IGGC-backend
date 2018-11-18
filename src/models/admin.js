const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'staff'],
    required: true,
  },
});

AdminSchema.pre('save', function hashPassword(next) {
  const admin = this;

  if (admin.isModified('password')) {
    bcrypt.genSalt(12, (err, salt) => {
      // eslint-disable-next-line
      bcrypt.hash(admin.password, salt, (err, hash) => {
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

AdminSchema.methods.toJSON = function toJSON() {
  const admin = this;
  const adminObject = admin.toObject();

  return _.omit(adminObject, ['password', '__v']);
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = { Admin };
