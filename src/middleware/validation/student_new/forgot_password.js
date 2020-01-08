const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');


const forgotPasswordValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide your name.'),
  body('date_of_birth')
    .trim()
    .isISO8601().withMessage('Please provide a valid date'),
  body('phone_number')
    .trim()
    .matches(/^[6789]\d{9}$/)
    .withMessage('Please provide valid mobile number'),

  sanitizeBody('name')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),
  sanitizeBody('date_of_birth')
    .trim(),
  sanitizeBody('phone_number')
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


const changePasswordValidation = [
  body('password')
    .trim()
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage('password should be at least 6 character long. Must contain at least one number and one special character.'),
  body('confirm_password')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirmation password dose not match.');
      } else return true;
    }),
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
  forgotPasswordValidation,
  changePasswordValidation,
};
