const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Student } = require('../../../models/student');

// student update basic info validation and sanitization
const updateStudentInfoValidation = [
  // validation
  body('email')
    .trim()
    .isEmail().withMessage('Invalid E-mail address')
    .custom(value => Student.findOne({ email: value })
      .then((student) => {
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
  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
  sanitizeBody('fatherName')
    .trim()
    .escape(),
  sanitizeBody('motherName')
    .trim()
    .escape(),
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

const updateStudentProfileValidation = [
  body('phoneNumber')
    .optional()
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
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Invalid E-mail address')
    .custom(value => Student.findOne({ email: value })
      .then((student) => {
        if (student) return Promise.reject(new Error('E-mail already in use'));
        return Promise.resolve();
      })),
  body('fatherName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your father name'),
  body('motherName')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your mother name'),
  body('dateOfBirth')
    .optional()
    .isISO8601('Please provide a valid date of birth'),
  body('gender')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your gender')
    .custom((value) => {
      if (!['male', 'female', 'other'].includes(value)) throw new Error('Gender must be "male", "female" or "other".');
      else return true;
    }),
  body('category')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your category'),
  body('religion')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your religion'),
  body('nationality')
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your nationality'),
  body('presentAddress')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Please provide your present Address'),
  body('permanentAddress')
    .optional()
    .isLength({ min: 1 })
    .withMessage('Please provide your permanent Address'),

  sanitizeBody('email')
    .trim(),
  sanitizeBody('phoneNumber')
    .trim(),
  sanitizeBody('fatherName')
    .trim(),
  sanitizeBody('motherName')
    .trim(),
  sanitizeBody('dateOfBirth')
    .trim(),
  sanitizeBody('category')
    .trim(),
  sanitizeBody('gender')
    .trim(),
  sanitizeBody('religion')
    .trim(),
  sanitizeBody('nationality')
    .trim(),
  sanitizeBody('presentAddress')
    .trim(),
  sanitizeBody('permanentAddress')
    .trim(),
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

const updateStudentNameValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your full name'),

  sanitizeBody('name')
    .trim(),

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
  updateStudentInfoValidation,
  updateStudentProfileValidation,
  updateStudentNameValidation,
};
