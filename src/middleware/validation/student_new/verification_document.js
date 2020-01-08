const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const deleteFile = require('../../../utilities/delete_file_promise');

const studentVerificationDocumentValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter a verification document title.'),

  sanitizeBody('title')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),

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


module.exports = { studentVerificationDocumentValidation };
