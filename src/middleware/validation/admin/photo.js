const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const deleteFile = require('../../../utilities/delete_file_promise');

const photoFieldsValidation = [
  body('title')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('subtitle')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('album')
    .trim()
    .isLength({ min: 1 }).withMessage('please select album')
    .custom((value) => {
      if (!['carousel', 'gallery', 'campus'].includes(value)) throw new Error('invalid album');
      return true;
    }),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  sanitizeBody('title')
    .trim(),
  sanitizeBody('subtitle')
    .trim(),
  sanitizeBody('album')
    .trim(),
  sanitizeBody('description')
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
  photoFieldsValidation,
};
