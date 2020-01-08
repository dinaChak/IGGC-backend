const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Branch } = require('../../../models/branch');

const subjectValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter title.'),
  body('branch')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter programme.')
    .custom(value => Branch.findOne({ title: value.toLowerCase() }).then((branch) => {
      if (!branch) {
        return Promise.reject(new Error('invalid branch'));
      }
      return Promise.resolve();
    })),
  body('is_major')
    .isBoolean().withMessage('Major can only be a boolean value.'),

  sanitizeBody('title')
    .trim(),

  sanitizeBody('branch')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),
  sanitizeBody('is_major')
    .toBoolean(),


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

const paperValidation = [
  body('title')
    .optional({ nullable: true, checkFalsy: true }),
  body('code')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter code.'),
  body('semester')
    .trim()
    .isInt().withMessage('Please enter valid semester'),
  body('selected')
    .optional({ nullable: true, checkFalsy: true })
    .isBoolean().withMessage('Selected can only be a boolean value.'),

  sanitizeBody('title')
    .trim(),
  sanitizeBody('code')
    .trim(),
  sanitizeBody('semester')
    .trim()
    .toInt(),
  sanitizeBody('selected')
    .toBoolean(),

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
  subjectValidation,
  paperValidation,
};
