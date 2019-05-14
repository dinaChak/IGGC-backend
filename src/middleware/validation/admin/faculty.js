const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Department } = require('../../../models/department');
const deleteFile = require('../../../utilities/delete_file_promise');


const facultyValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter name'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail().withMessage('Please provide valid email'),
  body('address')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('department')
    .trim()
    .isLength({ min: 1 }).withMessage('Please select department')
    .custom(async (value) => {
      const department = await Department.findById(value);
      if (!department) return Promise.reject(new Error('Invalid department'));
      return Promise.resolve();
    }),
  body('designation')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter designation'),
  body('seniority')
    .isNumeric()
    .withMessage('seniority must be a number'),
  body('education_qualification')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter education qualification'),
  body('date_of_join_as_prof_lec')
    .isISO8601()
    .withMessage('Must be a ISO Date'),
  body('date_of_join_iggc')
    .isISO8601()
    .withMessage('Must be a ISO Date'),
  body('net_slet')
    .optional({ nullable: true, checkFalsy: true })
    .custom((value) => {
      if (!['net', 'slet', 'both', 'none'].includes(String(value).toLowerCase())) {
        throw new Error('should only contain "NET" or "SLET" or "Both" or "None".');
      }
      return true;
    }),
  body('additional_responsibilities')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('other_information')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),

  sanitizeBody('name')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),
  sanitizeBody('email')
    .trim(),
  sanitizeBody('address')
    .trim(),
  sanitizeBody('phone')
    .trim(),
  sanitizeBody('department')
    .trim(),
  sanitizeBody('designation')
    .trim(),
  sanitizeBody('education_qualification')
    .trim(),
  sanitizeBody('seniority')
    .trim()
    .customSanitizer(value => Number(value)),
  sanitizeBody('date_of_join_as_prof_lec')
    .trim()
    .toDate(),
  sanitizeBody('date_of_join_iggc')
    .trim()
    .toDate(),
  sanitizeBody('net_slet')
    .trim(),
  sanitizeBody('additional_responsibilities')
    .trim(),
  sanitizeBody('other_information')
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
  facultyValidation,
};
