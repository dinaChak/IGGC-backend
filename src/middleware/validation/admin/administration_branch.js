const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');


const administrationBranchValidation = [
  body('title')
    .trim()
    .isLength({ min: 1 }).withMessage("please enter administration's branch title."),

  sanitizeBody('title')
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

const administrationBranchStaffValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter name.'),
  body('designation')
    .optional({ nullable: true, checkFalsy: true }),
  body('phoneNumber')
    .trim()
    .isNumeric()
    .withMessage('Please provide a valid phone number'),

  sanitizeBody('name')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),
  sanitizeBody('designation')
    .trim(),
  sanitizeBody('phoneNumber')
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


module.exports = {
  administrationBranchValidation,
  administrationBranchStaffValidation,
};
