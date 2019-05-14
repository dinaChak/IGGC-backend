const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Branch } = require('../../../models/branch');

const createBranchValidation = [
  // validation
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('title should not be empty')
    .custom(value => Branch.findOne({ title: value.toLowerCase() }).then((branch) => {
      if (branch) return Promise.reject(new Error('title already  created.'));
      return Promise.resolve();
    })),

  // sanitization
  sanitizeBody('title')
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


const updateBranchValidation = [
  // validation
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('title should not be empty'),

  // sanitization
  sanitizeBody('title')
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
  createBranchValidation,
  updateBranchValidation,
};
