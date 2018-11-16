const {
  body
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');
const {
  Types
} = require('mongoose');

const {
  Student
} = require('../models/student');


const studentRegistrationValidator = [
  // validation
  body('email')
  .trim()
  .isEmail().withMessage("Invalid email")
  .custom((value) => {
    return Student.findOne({
      email: value
    }).then((student) => {
      if (student) return Promise.reject('E-mail already in use');
    })
  }),
  body('password')
  .isLength({
    min: 6
  }).withMessage('must be at least 5 chars long')
  .matches(/\d/).withMessage('must contain a number'),
  body('confirmPassword')
  .custom((value, {
    req
  }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    } else {
      return true;
    }
  }),
  body('name')
  .isLength({
    min: 1
  }).withMessage('must not be empty')
  .trim()
  .escape(),
  body('dateOfBirth')
  .isISO8601(),
  body('gender')
  .custom(value => {
    if (!['male', 'female', 'other'].includes(value.trim().toLowerCase())) {
      throw new Error('gender must be male, female or other');
    } else {
      return true;
    }
  }),
  body('branch')
  .trim()
  .isLength({
    min: 1
  }).withMessage("branch is required")
  .custom(value => {
    if (value && !Types.ObjectId.isValid(value.trim())) {
      throw new Error('Invalid branch');
    } else {
      return true;
    }
  }),
  body('phoneNumber')
  .trim()
  .isNumeric().withMessage("phone number should only contain number")
  .isLength({
    min: 10,
    max: 10
  }).withMessage("phone number must be 10 digits"),

  // sanitization
  sanitizeBody('email')
  .trim()
  .normalizeEmail(),
  sanitizeBody('password')
  .trim()
  .escape(),
  sanitizeBody('confirmPassword')
  .trim()
  .escape(),
  sanitizeBody('name')
  .trim()
  .escape(),
  sanitizeBody('dateOfBirth')
  .toDate(),
  sanitizeBody('gender')
  .trim()
  .escape(),
  sanitizeBody('branch')
  .trim()
  .escape(),
  sanitizeBody('phoneNumber')
  .trim()
  .escape(),
]


module.exports = { studentRegistrationValidator };