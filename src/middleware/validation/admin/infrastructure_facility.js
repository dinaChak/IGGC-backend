const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const deleteFile = require('../../../utilities/delete_file_promise');

const infrastructureFacilityValidation = [
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
  async (req, res, next) => {
    try {
      let errors = [];
      const validationErrs = validationResult(req);
      if (!validationErrs.isEmpty()) {
        if (req.file) {
          await deleteFile(req.file.path);
        }
        errors = [...validationErrs.array()];
      }
      if (res.locals.fileErrors) {
        errors = [...res.locals.fileErrors, ...errors];
      }
      if (errors.length > 0) {
        return res.status(422).send({ errors });
      }
      return next();
    } catch (error) {
      return res.status(500).send();
    }
  },
];

module.exports = {
  infrastructureFacilityValidation,
};
