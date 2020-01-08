const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const massSMSValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 160 })
    .withMessage('message cannot be empty and larger than 160 characters.'),
  body('status')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide student status'),

  sanitizeBody('message')
    .trim(),
  sanitizeBody('status')
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

const singleSMSValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 160 })
    .withMessage('message cannot be empty and larger than 160 characters.'),
  body('number')
    .trim()
    .custom((value) => {
      if (Number.isNaN(Number(value)) || String(value).length !== 10) {
        throw new Error('phone number should only contain 10 digits');
      } else {
        return true;
      }
    }),

  sanitizeBody('message')
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


const manySMSValidation = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 160 })
    .withMessage('message cannot be empty and larger than 160 characters.'),
  body('numbers')
    .trim()
    .isArray()
    .withMessage('Numbers should be an array.'),

  sanitizeBody('message')
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
  massSMSValidation,
  singleSMSValidation,
  manySMSValidation,
};
