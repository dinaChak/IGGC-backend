const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const streamValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter title.'),
  body('description')
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ min: 20 })
    .withMessage('description should contain at least 20 character.'),

  sanitizeBody('title')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),
  sanitizeBody('description')
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


module.exports = { streamValidation };
