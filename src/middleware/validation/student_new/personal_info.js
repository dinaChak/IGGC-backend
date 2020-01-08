const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const { validationResult } = require('express-validator/check');


const studentPersonalInfoValidation = [
  body('fatherName')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter your father name.'),
  body('motherName')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter your mother name.'),
  body('religion')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter your religion.'),
  body('category.type')
    .trim()
    .isLength({ min: 1 }).withMessage('Please select a category.'),
  body('category.name')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
  body('nationality')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter your nationality.'),
  body('presentAddress.vill_town')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter village/town of present address.'),
  body('employed')
    .trim()
    .isBoolean(),
  body('presentAddress.ps_po')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter PS/PO of present address.'),
  body('presentAddress.state')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter State of present address.'),
  body('presentAddress.district')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter District of present address.'),
  body('presentAddress.pin')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter PINCODE of present address.'),

  body('permanentAddress.vill_town')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter village/town of permanent address.'),
  body('permanentAddress.ps_po')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter PS/PO of permanent address.'),
  body('permanentAddress.state')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter State of permanent address.'),
  body('permanentAddress.district')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter District of permanent address.'),
  body('permanentAddress.pin')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter PINCODE of permanent address.'),
  body('bank_detail.name')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter account holder name'),
  body('bank_detail.branch')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter branch'),
  body('bank_detail.ac_no')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter account no.'),
  body('bank_detail.IFSC_code')
    .trim()
    .isLength({ min: 1 }).withMessage('Please enter bank IFSC code'),
  body('aadhaar_no')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),

  sanitizeBody('fatherName')
    .trim(),
  sanitizeBody('motherName')
    .trim(),
  sanitizeBody('religion')
    .trim(),
  sanitizeBody('category.type')
    .trim(),
  sanitizeBody('category.name')
    .trim(),
  sanitizeBody('nationality')
    .trim(),
  sanitizeBody('employed')
    .toBoolean(),
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
  sanitizeBody('bank_detail.ac_no')
    .trim(),
  sanitizeBody('bank_detail.IFSC_code')
    .trim(),
  sanitizeBody('aadhaar_no')
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

module.exports = { studentPersonalInfoValidation };
