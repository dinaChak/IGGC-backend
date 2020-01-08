const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Student } = require('../../../models/student_new');

const studentRegistrationValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide your name.'),
  body('date_of_birth')
    .trim()
    .isISO8601().withMessage('Please provide a valid date'),
  body('gender')
    .trim()
    .custom((value) => {
      if (!['male', 'female', 'other'].includes(String(value).toLowerCase())) {
        throw new Error('Please select valid gender "male", "female" or "other"');
      } else return true;
    }),
  body('phone_number')
    .trim()
    .matches(/^[6789]\d{9}$/)
    .withMessage('Please provide valid mobile number')
    .custom(value => Student.findOne({ phone_number: value }).then((student) => {
      if (student) return Promise.reject(new Error('Mobile number is already registered.'));
      return Promise.resolve();
    })),
  body('confirm_phone_number')
    .custom((value, { req }) => {
      if (value !== req.body.phone_number) {
        throw new Error('Confirmation mobile number dose not match.');
      } else return true;
    }),
  body('email')
    .trim()
    .isEmail().withMessage('Please provide valid E-mail address'),
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

  sanitizeBody('name')
    .trim(),
  sanitizeBody('date_of_birth')
    .trim()
    .toDate(),
  sanitizeBody('gender')
    .trim(),
  sanitizeBody('phone_number')
    .trim(),
  sanitizeBody('email')
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

module.exports = { studentRegistrationValidation };
