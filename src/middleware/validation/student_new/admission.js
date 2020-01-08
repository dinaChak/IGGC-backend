const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Branch } = require('../../../models/branch');

const studentAdmissionValidation = [
  body('last_examination.examination')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination'),
  body('last_examination.institution')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination institution'),
  body('last_examination.board_uni')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination board/university'),
  body('last_examination.year_session')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination year/session.'),
  body('last_examination.result')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination result'),
  body('last_examination.division')
    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage('Please enter last examination division'),
  body('last_examination.roll_no')
    .isLength({ min: 1 })
    .withMessage('Please enter last examination roll no.'),
  body('last_examination.total_mark')
    .isNumeric({ no_symbols: true })
    .withMessage('Please enter last examination total mark'),
  body('last_examination.percentage')
    .isNumeric({ no_symbols: true })
    .withMessage('Please enter last examination percentage'),
  body('last_examination.subjects')
    .isArray().withMessage('Last examination subject should be an array of subject and mark.')
    .custom((value) => {
      if (!value.every(subject => subject.title && subject.mark)) {
        throw new Error('All subject should have title and mark');
      } else if (value.length < 4) {
        throw new Error('Please enter at least 4 subjects.');
      } else return true;
    }),
  body('uni_reg_no')
    .custom((value, { req }) => {
      if (req.body.semester > 1 && !value) {
        throw new Error('Please enter University registration no.');
      } else return true;
    }),
  body('uni_roll_no')
    .custom((value, { req }) => {
      if (req.body.semester > 1 && !value) {
        throw new Error('Please enter University Roll no.');
      } else return true;
    }),
  body('branch')
    .trim()
    .custom(value => Branch.findOne({ title: String(value).toLowerCase() }).then((branch) => {
      if (!branch) return Promise.reject(new Error('Please select a valid programme'));
      return Promise.resolve();
    })),
  body('semester')
    .trim()
    .isNumeric().withMessage('Please enter a semester number.')
    .custom((value) => {
      if (Number(value) < 1 || Number(value) > 8) {
        throw new Error('Please provide a valid semester number');
      } else return true;
    }),
  body('subjectCombination')
    .trim()
    .isArray().withMessage('Subject Combination should be an array of subject')
    .custom((value, { req }) => {
      const { branch } = req.body;
      if (!value.every(subject => subject.code && subject.title)) {
        throw new Error('All subject should have title and code');
      }
      if ((branch === 'b.a' || branch === 'b.sc') && value.length !== 4) {
        throw new Error('Please select 4 subjects.');
      } else if (value.length < 4) {
        throw new Error('Please select at least 4 subjects.');
      }
      return true;
    }),
  body('major_subject')
    .custom((value, { req }) => {
      const semester = Number(req.body.semester);
      const { branch } = req.body;
      if ((branch === 'b.a' || branch === 'b.sc') && (semester === 1 || semester === 3)) {
        if (!value) {
          throw new Error('Please enter a major subject from selected subject combination.');
        }
      }
      return true;
    }),

  sanitizeBody('last_examination.examination')
    .trim(),
  sanitizeBody('last_examination.board_uni')
    .trim(),
  sanitizeBody('last_examination.year_session')
    .trim(),
  sanitizeBody('last_examination.result')
    .trim(),
  sanitizeBody('last_examination.roll_no')
    .trim(),
  sanitizeBody('last_examination.total_mark')
    .toInt(),
  sanitizeBody('last_examination.percentage')
    .toInt(),
  sanitizeBody('uni_reg_no')
    .trim(),
  sanitizeBody('uni_roll_no')
    .trim(),
  sanitizeBody('branch')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),

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

module.exports = { studentAdmissionValidation };
