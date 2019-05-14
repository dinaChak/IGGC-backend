const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { CollegeProfile } = require('../../../models/college_profile');
const deleteFile = require('../../../utilities/delete_file_promise');


const collegeProfileExists = async (req, res, next) => {
  try {
    const collegeProfile = await CollegeProfile.find();
    if (collegeProfile.length !== 0) {
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

const collegeProfileValidation = [
  body('body')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide body.'),

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
  collegeProfileExists,
  collegeProfileValidation,
};
