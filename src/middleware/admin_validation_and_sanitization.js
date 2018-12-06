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


const { Admin } = require('../models/admin');
const {
  Branch,
} = require('../models/branch');


/**
 * ADMIN
 */
// Register new admin validation and sanitization
const adminRegistrationValidation = [
  // validation
  body('name')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('name should not be empty')
    .custom(value => Admin.findOne({
      name: value,
      // eslint-disable-next-line
    }).then((admin) => {
      // eslint-disable-next-line
      if (admin) return Promise.reject('Name already in use');
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
  body('role')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('Role should not be empty')
    .custom((value) => {
      if (!['admin', 'staff'].includes(value.trim().toLowerCase())) {
        throw new Error('Role should be Admin or Staff');
      } else {
        return true;
      }
    }),

  // sanitization
  sanitizeBody('name')
    .trim()
    .escape(),
  sanitizeBody('password')
    .trim()
    .escape(),
  sanitizeBody('role')
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

// admin login validation and sanitization
const adminLoginValidation = [
  // validation
  body('name')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('name should not be empty'),
  body('password')
    .isLength({
      min: 6,
    }).withMessage('must be at least 5 chars long')
    .matches(/\d/)
    .withMessage('must contain a number'),
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

// Create new branch validation and sanitization
const createBranchValidation = [
  // validation
  body('title')
    .trim()
    .isLength({
      min: 1,
    }).withMessage('title should not be empty')
    .custom(value => Branch.findOne({
      title: value,
    })
      // eslint-disable-next-line
      .then((branch) => {
      // eslint-disable-next-line
        if (branch) return Promise.reject('Branch exists');
      })),

  // sanitization
  sanitizeBody('title')
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

// create admission validation and sanitization
const createAdmissionValidation = [
  // validation
  body('openingDate')
    .isISO8601().withMessage('Must be a ISO Date'),
  body('closingDate')
    // 2009-02-29
    .isISO8601().withMessage('Must be a ISO Date'),
  body('openFor')
    .isArray().withMessage('openFor should be an array')
    .custom((value) => {
      if (value.length === 0) {
        throw new Error('openFor should not be empty');
      } else {
        return true;
      }
    }),
  body('from')
    .isISO8601().withMessage('Must be a ISO Date'),
  body('to')
    .isISO8601().withMessage('Must be a ISO Date'),

  // sanitization
  sanitizeBody('openingDate')
    .toDate(),
  sanitizeBody('closingDate')
    .toDate(),
  sanitizeBody('from')
    .toDate(),
  sanitizeBody('to')
    .toDate(),
  sanitizeBody('openFor')
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

// update studentInstance validation and sanitization
const updateStudentInstanceValidationStatusValidation = [
  // validation
  body('verificationStatus')
    .trim()
    .custom((value) => {
      if (!['verified', 'rejected'].includes(value)) {
        throw new Error('Invalid validationStatus');
      } else {
        return true;
      }
    }),

  // sanitization
  sanitizeBody('validationStatus')
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
  adminRegistrationValidation,
  adminLoginValidation,
  createBranchValidation,
  createAdmissionValidation,
  updateStudentInstanceValidationStatusValidation,
};
