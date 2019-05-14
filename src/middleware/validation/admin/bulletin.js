const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const deleteFile = require('../../../utilities/delete_file_promise');

const bulletinValidation = [
  body('title')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Title should contain at least 10 characters.'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description should contain at least 10 characters.'),
  body('body')
    .optional({ checkFalsy: true, nullable: true })
    .trim()
    .isLength({ min: 20 })
    .withMessage('Body should contain at least 20 characters.'),
  body('type')
    .trim()
    .custom((value) => {
      if (!['examinations', 'news', 'events'].includes(value)) throw new Error('Type should be "examinations", "news", or "events');
      return true;
    }),

  sanitizeBody('title')
    .trim(),
  sanitizeBody('description')
    .trim(),
  sanitizeBody('body')
    .trim(),
  sanitizeBody('type')
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

module.exports = { bulletinValidation };
