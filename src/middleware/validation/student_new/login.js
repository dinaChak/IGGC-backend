const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');


const studentLoginValidation = [
  body('phone_number')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter your registered mobile number.'),
  body('password')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide your password.'),

  sanitizeBody('phone_number')
    .trim(),
  sanitizeBody('password')
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


module.exports = { studentLoginValidation };
