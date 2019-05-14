const { Router } = require('express');

const {
  registration,
  login,
  updateStudentInfo,
  updateStudentProfile,
  updateStudentName,
  uploadProfileImage,
  uploadStudentSignature,
  semesterAdmission,
  uploadVerificationDocument,
  capturePayment,
  getStudentSemesters,
} = require('../controller/student_controller_new');

const {
  registrationValidation,
  loginValidation,
  updateStudentInfoValidation,
  updateStudentProfileValidation,
  updateStudentNameValidation,
  semesterAdmissionValidation,
} = require('../middleware/validation/student');

const { isAuthenticStudent } = require('../middleware/authentication');


const router = Router();

router.post('/registration', registrationValidation, registration);

router.post('/login', loginValidation, login);

router.post('/update', isAuthenticStudent, updateStudentInfoValidation, updateStudentInfo);

router.put('/update/profile', isAuthenticStudent, updateStudentProfileValidation, updateStudentProfile);

router.put('/update/name', isAuthenticStudent, updateStudentNameValidation, updateStudentName);

router.post('/profile/image/upload', isAuthenticStudent, uploadProfileImage);

router.post('/signature/image/upload', isAuthenticStudent, uploadStudentSignature);

router.post('/semester/admission', isAuthenticStudent, semesterAdmissionValidation, semesterAdmission);

router.post('/semester/verification/document/upload', isAuthenticStudent, uploadVerificationDocument);

router.get('/semester/admission/payment/:razorpay_payment_id', isAuthenticStudent, capturePayment);

router.get('/semesters', isAuthenticStudent, getStudentSemesters);

module.exports = router;
