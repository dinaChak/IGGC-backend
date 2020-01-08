const { Router } = require('express');
const path = require('path');

const {
  authenticateStudent,
} = require('../middleware/authentication');

const {
  studentLogin,
  registerStudent,
  updateStudentPersonalInfo,
  updateStudentProfileImg,
  updateStudentSignatureImg,
  studentAdmission,
  studentVerificationDocument,
  checkStatus,
  forgotPassword,
  changePassword,
} = require('../controller/student_controller');

const {
  studentRegistrationValidation,
  studentLoginValidation,
  studentPersonalInfoValidation,
  uploadValidation,
  studentAdmissionValidation,
  studentVerificationDocumentValidation,
  forgotPasswordValidation,
  changePasswordValidation,
} = require('../middleware/validation/student_new');
const localImageMulter = require('../middleware/uploads/image_local');

const localProfileImgProcessor = localImageMulter({
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  baseDir: 'images',
  fieldName: 'profile',
  imageOption: [350, 400, { fit: 'inside' }],
});

const localSignatureImgProcessor = localImageMulter({
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  baseDir: 'images',
  fieldName: 'signature',
  imageOption: [300, 200, { fit: 'inside' }],
});

const localVerificationDocProcessor = localImageMulter({
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  baseDir: 'images',
  fieldName: 'document',
  imageOption: [600, 800, { fit: 'inside' }],
});

const router = Router();

/**
 * Registration
 */
router.post(
  '/registration',
  studentRegistrationValidation,
  registerStudent,
);

/**
 * Login
 */
router.post(
  '/login',
  studentLoginValidation,
  studentLogin,
);

/**
 * Personal Info
 */
router.put(
  '/personal_info',
  authenticateStudent,
  studentPersonalInfoValidation,
  updateStudentPersonalInfo,
);

/**
 * profile image
 */
router.put(
  '/profile_image',
  authenticateStudent,
  localProfileImgProcessor.fieldValidationRequired.bind(localProfileImgProcessor),
  uploadValidation,
  updateStudentProfileImg,
);

/**
 * signature image
 */
router.put(
  '/signature_image',
  authenticateStudent,
  localSignatureImgProcessor.fieldValidationRequired.bind(localSignatureImgProcessor),
  uploadValidation,
  updateStudentSignatureImg,
);

/**
 * admission
 */
router.put(
  '/admission',
  authenticateStudent,
  (req, res, next) => {
    if (
      req.student.admissionStatus === 'verified'
      || req.student.admissionStatus === 'completed'
    ) {
      res.status(423).send({
        error: {
          msg: req.student.admissionStatus === 'verified'
            ? 'You cannot change your academic detail, as your application have been verified'
            : 'You cannot change your academic detail, as your admission have been completed',
        },
      });
    } else {
      next();
    }
  },
  studentAdmissionValidation,
  studentAdmission,
);

/**
 * Verification documents
 */
router.put(
  '/verification_document',
  authenticateStudent,
  localVerificationDocProcessor.fieldValidationRequired.bind(localVerificationDocProcessor),
  studentVerificationDocumentValidation,
  studentVerificationDocument,
);

/**
 * Check Status
 */
router.get(
  '/admission_status',
  authenticateStudent,
  checkStatus,
);

/**
 *  Forgot Password
 */
router.post(
  '/forgot_password',
  forgotPasswordValidation,
  forgotPassword,
);

/**
 * Change Password
 */
router.post(
  '/change_password',
  changePasswordValidation,
  changePassword,
);

/**
 * Secure
 */
router.get(
  '/secure',
  authenticateStudent,
  (req, res) => {
    res.send({
      message: 'Success',
      student: req.student,
    });
  },
);

module.exports = router;
