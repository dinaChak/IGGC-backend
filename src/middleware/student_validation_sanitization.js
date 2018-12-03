const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Student } = require('../models/student');
const { Branch } = require('../models/branch');

// student registration's validation and sanitization
const registrationValidation = [
  // validation
  body('phoneNumber')
    .trim()
    .custom((value) => {
      if (Number.isNaN(Number(value)) || value.length !== 10) {
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
    .custom(value => Branch.findOne({ _id: value }).then((branch) => {
      if (!branch) return Promise.reject(new Error('Invalid branch'));
      return Promise.resolve();
    })),

  // sanitization
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
      if (Number.isNaN(Number(value)) || value.length !== 10) {
        throw new Error('phone number should only contain 10 digits');
      } else {
        return true;
      }
    }),
  body('password')
    .isLength({
      min: 6,
    }).withMessage('must be at least 5 chars long')
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

// student update basic info validation and sanitization
const updateBasicInfoValidation = [
  // validation
  body('name')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('Name should not be empty'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid E-mail address')
    .custom(value => Student.findOne({ email: value })
      .then((student) => {
        console.log(student);
        if (student) return Promise.reject(new Error('E-mail already in use'));
        return Promise.resolve();
      })),
  body('fatherName')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('Father name should not be empty'),
  body('motherName')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('Mother name should not be empty'),
  body('dateOfBirth')
    .trim()
    .isISO8601().withMessage('Must be a ISO Date'),
  body('gender')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('Gender should not be empty')
    .custom((value) => {
      if (!['male', 'female', 'other'].includes(value)) {
        throw new Error('gender must be male, female or other');
      } else {
        return true;
      }
    }),
  body('religion')
    .isLength({
      min: 1,
    }).withMessage('Please provide religion'),
  body('category')
    .isLength({
      min: 1,
    }).withMessage('Please provide category'),
  body('nationality')
    .isLength({
      min: 1,
    }).withMessage('Please provide nationality'),
  body('presentAddress')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('presentAddress should not be empty'),
  body('permanentAddress')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('permanentAddress should not be empty'),

  // sanitization
  sanitizeBody('name')
    .trim()
    .escape(),
  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
  sanitizeBody('fatherName')
    .trim()
    .escape(),
  sanitizeBody('motherName')
    .trim()
    .escape(),
  sanitizeBody('dateOfBirth')
    .toDate(),
  sanitizeBody('gender')
    .trim()
    .escape(),
  sanitizeBody('permanentAddress')
    .trim()
    .escape(),
  sanitizeBody('presentAddress')
    .trim()
    .escape(),
  sanitizeBody('religion')
    .trim()
    .escape(),
  sanitizeBody('category')
    .trim()
    .escape(),
  sanitizeBody('nationality')
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

// new semester admission validation and sanitization
const semesterAdmissionValidation = [
  // validation
  body('semester')
    .trim()
    .isNumeric().withMessage('Semester must be a Number'),

  // sanitization
  body('semester')
    .trim()
    .toInt(),

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
  updateBasicInfoValidation,
  semesterAdmissionValidation,
};
