const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Principal } = require('../../../models/principal');
const deleteFile = require('../../../utilities/delete_file_promise');

const principalExists = async (req, res, next) => {
  try {
    const principal = await Principal.find();
    if (principal.length !== 0) {
      res.status(422).send({
        location: 'body',
        msg: 'Principle already exists',
        param: 'name',
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).send();
  }
};

const principalValidation = [
  body('name')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter name.'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .isEmail().withMessage('Please provide valid email.'),
  body('address')
    .optional({ nullable: true, checkFalsy: true }),
  body('phone')
    .optional({ nullable: true, checkFalsy: true }),
  body('education_qualification')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide education qualification'),
  body('date_of_join_iggc')
    .isISO8601()
    .withMessage('Please provide date of of joining IGGC'),
  body('other_information')
    .optional({ nullable: true, checkFalsy: true }),
  body('message')
    .trim()
    .isLength({ min: 10 }).withMessage('Please provide message.'),

  sanitizeBody('name')
    .trim(),
  sanitizeBody('email')
    .trim(),
  sanitizeBody('address')
    .trim(),
  sanitizeBody('phone')
    .trim(),
  sanitizeBody('education_qualification')
    .trim(),
  sanitizeBody('date_of_join_iggc')
    .trim()
    .toDate(),
  sanitizeBody('other_information')
    .trim(),
  sanitizeBody('message')
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
  principalExists,
  principalValidation,
};
