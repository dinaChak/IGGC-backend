const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Branch } = require('../../../models/branch');

const sessionValidation = [
  // validation
  body('from')
    .trim()
    .isISO8601().withMessage('from should be a date.'),
  body('to')
    .trim()
    .isISO8601().withMessage('to should be a date.'),

  // sanitization
  sanitizeBody('from')
    .trim()
    .toDate(),
  sanitizeBody('to')
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

const admissionValidation = [
  // validation
  body('semesterType')
    .trim()
    .custom((value) => {
      if (!['odd', 'even'].includes(String(value).toLowerCase())) {
        throw new Error('semester type should only be even or odd');
      } else {
        return true;
      }
    }),
  body('openingDate')
    .trim()
    .isISO8601().withMessage('closing date should be a date.'),
  body('closingDate')
    .trim()
    .isISO8601().withMessage('closing date should be a date.'),
  body('branches')
    .isArray().withMessage('branches must be an array')
    .custom(async (value) => {
      const branches = await Branch.find();
      if (
        !value.every(x => branches.map(branch => branch.title)
          .includes(String(x.title)
            .toLowerCase()))
      ) {
        return Promise.reject(new Error('Invalid branch'));
      }
      return Promise.resolve();
    })
    .custom((value, { req }) => {
      let reVal = true;
      if (req.body.semesterType.toLowerCase() === 'odd') {
        for (let i = 0; i < value.length; i += 1) {
          if (!value[i].semesterFees.every(semesterFee => semesterFee.semester % 2 !== 0)) {
            reVal = Promise.reject(new Error('Only odd number is allowed for odd semester'));
            break;
          }
        }
      } else if (req.body.semesterType.toLowerCase() === 'even') {
        for (let i = 0; i < value.length; i += 1) {
          if (!value[i].semesterFees.every(semesterFee => semesterFee.semester % 2 === 0)) {
            reVal = Promise.reject(new Error('Only even number is allowed for even semester'));
            break;
          }
        }
      }
      return reVal;
    }),

  // sanitization
  sanitizeBody('semesterType')
    .trim()
    .escape(),
  sanitizeBody('openingDate')
    .trim()
    .toDate(),
  sanitizeBody('closingDate')
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
  sessionValidation,
  admissionValidation,
};
