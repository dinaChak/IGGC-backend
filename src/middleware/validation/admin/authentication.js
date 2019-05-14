const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

// login validation and sanitization
const loginValidation = [
  // validation
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Name should not be empty'),
  body('password')
    .isLength({
      min: 6,
    }).withMessage('password must be at least 6 chars long')
    .matches(/\d/)
    .withMessage('password must contain a number'),

  // sanitization
  sanitizeBody('name')
    .trim()
    .escape(),
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
  loginValidation,
};
