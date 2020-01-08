const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const admissionNewValidation = [
  body('instruction')
    .optional({ nullable: true, checkFalsy: true }),
  body('feeStructure')
    .optional({ nullable: true, checkFalsy: true }),

  sanitizeBody('instruction')
    .trim(),
  sanitizeBody('feeStructure')
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


const admissionDatesValidation = [
  body('from')
    .trim()
    .isISO8601().withMessage('Please provide session start date.'),
  body('to')
    .trim()
    .isISO8601().withMessage('Please provide session end date.'),
  body('start_date')
    .trim()
    .isISO8601().withMessage('Please provide Admission start date.'),
  body('end_date')
    .trim()
    .isISO8601().withMessage('Please provide Admission end date.'),
  body('semesters')
    .isArray().withMessage('semesters should be a array of number')
    .custom((value) => {
      if (!value.every(semester => typeof semester === 'number')) {
        throw new Error('Semester must be a number');
      } else if (value.length < 1) {
        throw new Error('Semesters must not be empty');
      } else return true;
    }),

  sanitizeBody('from')
    .trim()
    .toDate(),
  sanitizeBody('to')
    .trim()
    .toDate(),
  sanitizeBody('start_date')
    .trim()
    .toDate(),
  sanitizeBody('end_date')
    .trim()
    .toDate(),

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
  admissionNewValidation,
  admissionDatesValidation,
};
