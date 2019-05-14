const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Subject } = require('../../../models/subject');
const { Branch } = require('../../../models/branch');
const deleteFile = require('../../../utilities/delete_file_promise');

const syllabusValidation = [
  body('branch')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide programme.')
    .custom(value => Branch.findOne({ title: value.toLowerCase() }).then((branch) => {
      if (!branch) {
        return Promise.reject(new Error('invalid programme'));
      }
      return Promise.resolve();
    })),
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage('please provide subject')
    .custom(value => Subject.findOne({ title: value }).then((subject) => {
      if (!subject) return Promise.reject(new Error('Invalid subject.'));
      return Promise.resolve();
    })),

  sanitizeBody('branch')
    .trim()
    .customSanitizer(value => value.toLowerCase()),
  sanitizeBody('title')
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

module.exports = { syllabusValidation };
