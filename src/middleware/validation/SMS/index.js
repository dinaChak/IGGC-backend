const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');


const smsValidation = [
  body('message')
    .trim()
    .isLength({ max: 160 })
    .withMessage('message can not have more than 160 characters.'),

  sanitizeBody('message')
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


module.exports = { smsValidation };
