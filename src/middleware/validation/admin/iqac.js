const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const minuteValidation = [
  body('date')
    .trim()
    .isISO8601().withMessage('Please enter a date'),
  body('link')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide a link'),

  sanitizeBody('date')
    .trim()
    .toDate(),
  sanitizeBody('link')
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

const aqarValidation = [
  body('from')
    .trim()
    .isISO8601().withMessage('Please enter a from date'),
  body('to')
    .trim()
    .isISO8601().withMessage('Please enter a to date'),
  body('link')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide a link'),

  sanitizeBody('from')
    .trim()
    .toDate(),
  sanitizeBody('to')
    .trim()
    .toDate(),
  sanitizeBody('link')
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
  minuteValidation,
  aqarValidation,
};
