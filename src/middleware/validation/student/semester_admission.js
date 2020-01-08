const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');
const mongoose = require('mongoose');

const { Subject } = require('../../../models/subject');

const semesterAdmissionValidation = [
  body('branch')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide Programme'),
  body('number')
    .trim()
    .isNumeric().withMessage('Semester should be 1, 2, 3, 4, 5, or 6.')
    .custom((value) => {
      if (![1, 2, 3, 4, 5, 6].includes(Number(value))) {
        throw new Error('Semester should be 1, 2, 3, 4, 5, or 6.');
      }
      return true;
    }),
  body('session')
    .trim()
    .isLength({ min: 1 }).withMessage('Please provide session')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) throw new Error('Invalid session');
      return true;
    }),
  body('subjectCombination')
    .isArray().withMessage('Subject must be a array')
    .custom((value, { req }) => Subject.find({
      branch: req.user.branch.toLowerCase(),
      semester: req.body.number,
    }).then((subjects) => {
      if (subjects.length === 0) return Promise.reject(new Error('Invalid semester'));
      for (let i = 0; i < value.length; i += 1) {
        // eslint-disable-next-line
          if (!subjects.find(subject => subject._id.toHexString() === value[i]._id)) return Promise.reject(new Error(`${value[i].title} is invalid`));
      }
      return Promise.resolve();
    })),
  body('amount')
    .isNumeric().withMessage('Fees amount should be a number'),

  // sanitization
  sanitizeBody('branch')
    .trim(),
  sanitizeBody('number')
    .toInt(),
  sanitizeBody('amount')
    .toInt(),

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
  semesterAdmissionValidation,
};
