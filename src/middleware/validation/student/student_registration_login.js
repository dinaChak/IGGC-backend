const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Student } = require('../../../models/student');
const { Branch } = require('../../../models/branch');


// student registration's validation and sanitization
const registrationValidation = [
  // validation
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Name should not be empty'),
  body('dateOfBirth')
    .trim()
    .isISO8601().withMessage('Must be a ISO Date'),
  body('phoneNumber')
    .trim()
    .custom((value) => {
      if (Number.isNaN(Number(value)) || String(value).length !== 10) {
        throw new Error('phone number should only contain 10 digits');
      } else {
        return true;
      }
    })
    .custom(value => Student.findOne({ phoneNumber: value }).then((student) => {
      if (student) return Promise.reject(new Error('phone number already in use'));
      return Promise.resolve();
    })),
  body('password')
    .isLength({
      min: 6,
    }).withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),
  body('confirmPassword')
    .custom((value, {
      req,
    }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      } else {
        return true;
      }
    }),
  body('branch')
    .trim()
    .custom(value => Branch.findOne({ title: value }).then((branch) => {
      if (!branch) return Promise.reject(new Error('Invalid branch'));
      return Promise.resolve();
    })),

  // sanitization
  sanitizeBody('name')
    .trim()
    .escape(),
  sanitizeBody('dateOfBirth')
    .toDate(),
  sanitizeBody('phoneNumber')
    .trim()
    .toInt(),
  sanitizeBody('password')
    .trim()
    .escape(),
  sanitizeBody('confirmPassword')
    .trim()
    .escape(),
  body('branch')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        errors: errors.array(),
      });
    }
    return next();
  },
];

// login validation and sanitization
const loginValidation = [
  // validation
  body('phoneNumber')
    .trim()
    .custom((value) => {
      if (Number.isNaN(Number(value)) || String(value).length !== 10) {
        throw new Error('phone number should only contain 10 digits');
      } else {
        return true;
      }
    }),
  body('password')
    .isLength({
      min: 6,
    }).withMessage('must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),

  // sanitization
  sanitizeBody('phoneNumber')
    .trim()
    .toInt(),
  sanitizeBody('password')
    .trim()
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({
        errors: errors.array(),
      });
    }
    return next();
  },
];

module.exports = {
  registrationValidation,
  loginValidation,
};
