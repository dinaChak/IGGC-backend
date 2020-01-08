const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');

const { Student } = require('../../../models/student');
const { Branch } = require('../../../models/branch');


const verifyStudentValidation = [
  body('status')
    .trim()
    .isLength({ min: 1 }).withMessage('verification status should not be empty')
    .custom((value) => {
      if (!['verified', 'rejected'].includes(value)) {
        throw new Error('verification should only be "rejected" or "verified"');
      } else return true;
    }),
  body('rejection_reasons')
    .optional(),

  sanitizeBody('status')
    .trim(),
  sanitizeBody('rejection_reasons')
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

const updateStudentSemesterInternalValidation = [
  body('number')
    .isNumeric().withMessage('internal must be a number'),
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

const updateStudentSemesterExternalValidation = [
  body('result')
    .trim()
    .isLength({ min: 1 }).withMessage('Please select a result')
    .custom((value) => {
      if (!['pass', 'pwbp', 'fail'].includes(value)) throw new Error('Result should be "pass", "pwbp", "fail".');
      else return true;
    }),
  body('status')
    .trim()
    .isLength({ min: 1 }).withMessage('Please select admission status')
    .custom((value) => {
      if (!['eligible', 'ineligible'].includes(value)) throw new Error('Admission status should be "eligible", "ineligible".');
      else return true;
    }),
  sanitizeBody('result')
    .trim(),
  sanitizeBody('status')
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

const updateStudentRollNoValidation = [
  body('rollNumber')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide roll number')
    .custom(value => Student.findOne({ rollNumber: value }).then((student) => {
      if (student) return Promise.reject(new Error(`roll no. ${value} is already in use.`));
      return Promise.resolve();
    })),
  sanitizeBody('rollNumber')
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

const updateStudentSubjectCombinationValidation = [
  body('subjectCombination')
    .trim()
    .isArray().withMessage('Subject Combination should be an array of subject')
    .custom((value) => {
      if (!value.every(subject => subject.code && subject.title)) {
        throw new Error('All subject should have title and code');
      }
      return true;
    }),
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

const updateStudentValidation = [
  body('name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your name.'),
  body('date_of_birth')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('gender')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!['male', 'female', 'other'].includes(String(value).toLowerCase())) {
        throw new Error('Please select valid gender "male", "female" or "other"');
      } else return true;
    }),
  body('fatherName')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide your father's name."),
  body('motherName')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage("Please provide your mother's name."),
  body('religion')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your religion.'),
  body('category')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your category.'),
  body('presentAddress.vill_town')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your present address village/town.'),
  body('presentAddress.ps_po')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your present address police station/post office.'),
  body('presentAddress.state')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your present address state.'),
  body('presentAddress.district')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your present address district.'),
  body('presentAddress.pin')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your present address pin.'),

  body('permanentAddress.vill_town')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your permanent address village/town.'),
  body('permanentAddress.ps_po')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your permanent address police station/post office.'),
  body('permanentAddress.state')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your permanent address state.'),
  body('permanentAddress.district')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your permanent address district.'),
  body('permanentAddress.pin')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide your permanent address pin.'),

  body('bank_detail.name')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter account holder name'),
  body('bank_detail.branch')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter branch'),
  body('bank_detail.ac_no')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter account no.'),
  body('bank_detail.IFSC_code')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter bank IFSC code'),
  body('aadhaar_no')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter valid aadhaar no.'),
  body('employed')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isBoolean(),
  body('have_disability')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isBoolean(),

  body('last_examination.examination')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination'),
  body('last_examination.institution')
    .optional({ nullable: true, checkFalsy: true })

    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination institution'),
  body('last_examination.board_uni')
    .optional({ nullable: true, checkFalsy: true })

    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination board/university'),
  body('last_examination.year_session')
    .optional({ nullable: true, checkFalsy: true })

    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination year/session.'),
  body('last_examination.result')
    .optional({ nullable: true, checkFalsy: true })

    .trim()
    .isLength({ min: 1 })
    .withMessage('Please enter last examination result'),
  body('last_examination.division')
    .optional({ nullable: true, checkFalsy: true })

    .optional({ nullable: true, checkFalsy: true })
    .isLength({ min: 1 })
    .withMessage('Please enter last examination division'),
  body('last_examination.roll_no')
    .optional({ nullable: true, checkFalsy: true })

    .isLength({ min: 1 })
    .withMessage('Please enter last examination roll no.'),
  body('last_examination.total_mark')
    .optional({ nullable: true, checkFalsy: true })

    .isNumeric({ no_symbols: true })
    .withMessage('Please enter last examination total mark'),
  body('last_examination.percentage')
    .optional({ nullable: true, checkFalsy: true })

    .isNumeric({ no_symbols: true })
    .withMessage('Please enter last examination percentage'),
  body('last_examination.subjects')
    .optional({ nullable: true, checkFalsy: true })

    .isArray().withMessage('Last examination subject should be an array of subject and mark.')
    .custom((value) => {
      if (!value.every(subject => subject.title && subject.mark)) {
        throw new Error('All subject should have title and mark');
      } else return true;
    }),
  body('branch')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .custom(value => Branch.findOne({ title: String(value).toLowerCase() }).then((branch) => {
      if (!branch) return Promise.reject(new Error('Please select a valid programme'));
      return Promise.resolve();
    })),
  body('uni_reg_no')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide student registration no.'),
  body('uni_roll_no')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide student university roll no.'),
  body('class_roll_no')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide student class roll no.'),
  body('subjectCombination')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isArray()
    .withMessage('Subject Combination should be an array of subject'),
  body('major_subject')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 1 })
    .withMessage('Please provide student major subject.'),

  sanitizeBody('name')
    .trim(),
  sanitizeBody('date_of_birth')
    .trim()
    .toDate(),
  sanitizeBody('gender')
    .trim(),
  sanitizeBody('fatherName')
    .trim(),
  sanitizeBody('motherName')
    .trim(),
  sanitizeBody('religion')
    .trim(),
  sanitizeBody('category')
    .trim(),
  sanitizeBody('presentAddress')
    .customSanitizer(({
      // eslint-disable-next-line
      vill_town, ps_po, state, district, pin,
    }) => ({
      vill_town: vill_town.trim(),
      ps_po: ps_po.trim(),
      state: state.trim(),
      district: district.trim(),
      pin,
    })),
  sanitizeBody('permanentAddress')
    .customSanitizer(({
    // eslint-disable-next-line
    vill_town, ps_po, state, district, pin,
    }) => ({
      vill_town: vill_town.trim(),
      ps_po: ps_po.trim(),
      state: state.trim(),
      district: district.trim(),
      pin,
    })),
  sanitizeBody('bank_detail.name')
    .trim(),
  sanitizeBody('bank_detail.branch')
    .trim(),
  sanitizeBody('bank_detail.ac_no')
    .trim(),
  sanitizeBody('bank_detail.IFSC_code')
    .trim(),
  sanitizeBody('aadhaar_no')
    .trim(),
  sanitizeBody('employed')
    .trim()
    .toBoolean(),
  sanitizeBody('have_disability')
    .trim()
    .toBoolean(),
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
  sanitizeBody('branch')
    .trim()
    .customSanitizer(value => String(value).toLowerCase()),
  sanitizeBody('uni_reg_no')
    .trim(),
  sanitizeBody('uni_roll_no')
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
  verifyStudentValidation,
  updateStudentSemesterInternalValidation,
  updateStudentSemesterExternalValidation,
  updateStudentRollNoValidation,
  updateStudentSubjectCombinationValidation,
  updateStudentValidation,
};
