const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const updateAcademicDetailValidation = [
  body('failed')
    .isBoolean()
    .withMessage('Please provide a valid value'),
  body('session')
    .trim()
    .custom((value, { req }) => {
      if (!req.body.failed && (!value || value.trim() === '')) {
        throw new Error('Please provide a valid session value');
      } else {
        return true;
      }
    }),
  body('subjectCombination')
    // eslint-disable-next-line consistent-return
    .custom((value, { req }) => {
      if (!req.body.failed) {
        if (!(value instanceof Array)) {
          throw new Error('Subject combination should an array.');
        } else if (value.length === 0) {
          throw new Error('Subjection combination should not empty.');
        } else {
          return true;
        }
      } else {
        return true;
      }
    }),
  sanitizeBody('session')
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

module.exports = { updateAcademicDetailValidation };
