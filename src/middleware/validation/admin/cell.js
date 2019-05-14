const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const cellValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('please enter title'),
  body('subtitle')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('position')
    .isNumeric()
    .withMessage('position must be a number'),
  body('body')
    .trim()
    .isLength({ min: 1 }).withMessage('please enter body'),

  sanitizeBody('title')
    .trim(),
  sanitizeBody('subtitle')
    .trim(),
  sanitizeBody()
    .customSanitizer(value => Number(value)),
  sanitizeBody('body')
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

module.exports = { cellValidation };
