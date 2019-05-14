const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Student } = require('../../../models/student');


const verifyStudentValidation = [
  body('status')
    .trim()
    .isLength({ min: 1 }).withMessage('verification status should not be empty')
    .custom((value) => {
      if (!['verified', 'rejected'].includes(value)) {
        throw new Error('verification should only be "rejected" or "verified"');
      } else return true;
    }),
  body('rejection_reasons')
    .optional(),

  sanitizeBody('status')
    .trim(),
  sanitizeBody('rejection_reasons')
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

const updateStudentSemesterInternalValidation = [
  body('number')
    .isNumeric().withMessage('internal must be a number'),
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

const updateStudentSemesterExternalValidation = [
  body('result')
    .trim()
    .isLength({ min: 1 }).withMessage('Please select a result')
    .custom((value) => {
      if (!['pass', 'pwbp', 'fail'].includes(value)) throw new Error('Result should be "pass", "pwbp", "fail".');
      else return true;
    }),
  body('status')
    .trim()
    .isLength({ min: 1 }).withMessage('Please select admission status')
    .custom((value) => {
      if (!['eligible', 'ineligible'].includes(value)) throw new Error('Admission status should be "eligible", "ineligible".');
      else return true;
    }),
  sanitizeBody('result')
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

const updateStudentRollNoValidation = [
  body('rollNumber')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide roll number')
    .custom(value => Student.findOne({ rollNumber: value }).then((student) => {
      if (student) return Promise.reject(new Error(`roll no. ${value} is already in use.`));
      return Promise.resolve();
    })),
  sanitizeBody('rollNumber')
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
  verifyStudentValidation,
  updateStudentSemesterInternalValidation,
  updateStudentSemesterExternalValidation,
  updateStudentRollNoValidation,
};
