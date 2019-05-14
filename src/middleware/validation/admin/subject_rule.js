const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Branch } = require('../../../models/branch');

// subjectRule validation
const subjectRuleValidation = [
  body('branch')
    .trim()
    .isLength({ min: 1 }).withMessage('Programme should not be empty')
    .custom(value => Branch.findOne({ title: value }).then((branch) => {
      if (!branch) return Promise.reject(new Error(`Programme ${value} is invalid`));
      return Promise.resolve();
    })),
  body('rule')
    .trim()
    .isLength({ min: 1 }).withMessage('rule should not be empty'),

  // sanitization
  sanitizeBody('branch')
    .trim(),
  sanitizeBody('rule')
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
  subjectRuleValidation,
};
