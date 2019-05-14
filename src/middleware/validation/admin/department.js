const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');
const { isValid } = require('mongoose').Types.ObjectId;

const { Stream } = require('../../../models/stream'); 

const departmentValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide title'),
  body('description')
    .trim()
    .isLength({ min: 20 })
    .withMessage('Description should at least contain 20 characters.'),
  body('stream')
    .trim()
    .custom(async (value) => {
      if (!isValid(value)) return Promise.reject(new Error('Invalid stream'));
      const stream = await Stream.findById(value);
      if (!stream) return Promise.reject(new Error('Invalid stream'));
      return Promise.resolve();
    }),

  sanitizeBody('title')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),

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
  departmentValidation,
};
