// @ts-check
const {
  body,
} = require('express-validator/check');
const {
  sanitizeBody,
} = require('express-validator/filter');
const {
  validationResult,
} = require('express-validator/check');

const {
  Student,
} = require('../models/student');
const {
  Branch,
} = require('../models/branch');

/**
 * Student
 */
// student registration validation and sanitization
const studentRegistrationValidator = [
  // validation
  body('phoneNumber')
    .trim()
    .custom((value) => {
      if (!Number.isNaN(Number(value))) {
        throw new Error('phone number should only contain 10 digits');
      } else {
        return true;
      }
    })
    .custom(value => Student.findOne({
      phoneNumber: value,
      // eslint-disable-next-line
    }).then((student) => {
      // eslint-disable-next-line
      if (student) return Promise.reject('phone number already in use');
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
  body('name')
    .isLength({
      min: 1,
    }).withMessage('must not be empty')
    .trim()
    .escape(),
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
  sanitizeBody('name')
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


// student login route validation and sanitization
const studentLoginValidation = [
  // validation
  body('email')
    .trim()
    .isEmail().withMessage('Invalid E-mail address'),
  body('password')
    .isLength({
      min: 6,
    }).withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),

  // sanitization,
  sanitizeBody('email')
    .trim()
    .normalizeEmail(),
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

//  new student admission validation and sanitization
const updateStudentDetailsValidation = [
  // validation
  body('name')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('should not be empty'),
  body('email')
    .trim()
    .isEmail().withMessage('Invalid E-mail address'),
  body('fatherName')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('should not be empty'),
  body('motherName')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('should not be empty'),
  body('gender')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('gender must not empty')
    .custom((value) => {
      if (!['male', 'female', 'other'].includes(value)) {
        throw new Error('gender must be male, female or other');
      } else {
        return true;
      }
    }),
  body('dateOfBirth')
    .isISO8601().withMessage('Must be a ISO Date'),
  body('phoneNumber')
    .trim()
    .custom((value) => {
      if (Number.isNaN(Number(value)) || value.length !== 10) {
        throw new Error('phone number must be 10 digits');
      } else {
        return true;
      }
    }),
  body('permanentAddress')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('permanentAddress should not be empty'),
  body('presentAddress')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('presentAddress should not be empty'),
  body('religion')
    .isLength({
      min: 1,
    }).withMessage('must provide religion'),
  body('category')
    .isLength({
      min: 1,
    }).withMessage('must provide category'),
  body('nationality')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('must provide nationality'),

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
  sanitizeBody('phoneNumber')
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

// new student admission
const studentNewAdmissionValidation = [
  body('branch')
    .trim()
    .custom(value => Branch.findById(value)
      .then((branch) => {
        if (!branch) {
          return Promise.reject(new Error('Invalid branch'));
        }
        return Promise.resolve();
      })),
  body('semester')
    .trim()
    .isLength({
      min: 1,
    })
    .withMessage('should not be empty')
    .isNumeric()
    .withMessage('must be an number'),

  sanitizeBody('branch')
    .trim()
    .escape(),
  sanitizeBody('semester')
    .trim()
    .escape()
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

// create new semester admission
const studentSemesterAdmissionValidation = [
  body('semester')
    .trim()
    .isLength({
      min: 1,
    })
    .withMessage('should not be empty')
    .isNumeric()
    .withMessage('must be an number'),
  sanitizeBody('semester')
    .trim()
    .escape()
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
  studentRegistrationValidator,
  studentLoginValidation,
  updateStudentDetailsValidation,
  studentSemesterAdmissionValidation,
  studentNewAdmissionValidation,
};
