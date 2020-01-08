const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const marqueeValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide title.'),
  body('link')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide link.'),

  sanitizeBody('title')
    .trim(),
  sanitizeBody('link')
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


module.exports = { marqueeValidation };
