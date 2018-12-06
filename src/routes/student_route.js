const { Router } = require('express');

const {
  registrationController,
  loginController,
  updateBasicInfoController,
  uploadProfileImage,
  uploadStudentSignature,
  newSemesterAdmission,
  uploadVerificationDocument,
  capturePayment,

} = require('../controller/student_controller');
const {
  registrationValidation,
  loginValidation,
  updateBasicInfoValidation,
  semesterAdmissionValidation,
} = require('../middleware/student_validation_sanitization');
const { isAuthenticStudent } = require('../middleware/authentication');

const router = Router();

// POST registration
router.post('/registration', registrationValidation, registrationController);

// POST login
router.post('/login', loginValidation, loginController);

// PUT update student basic info
router.put('/update', isAuthenticStudent, updateBasicInfoValidation, updateBasicInfoController);

// POST upload profile image
router.post('/profileimage/upload', isAuthenticStudent, uploadProfileImage);

// POST upload student signature image
router.post('/signature/upload', isAuthenticStudent, uploadStudentSignature);

// POST new semester admission
router.post('/admission/new', isAuthenticStudent, semesterAdmissionValidation, newSemesterAdmission);

// POST upload verification document
router.post('/verification/document/upload', isAuthenticStudent, uploadVerificationDocument);

// GET capture payment
router.get('/admission/fees/payment/:razorpay_payment_id', isAuthenticStudent, capturePayment);


module.exports = router;
