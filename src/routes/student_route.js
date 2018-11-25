const { Router } = require('express');

const {
  registrationController,
  loginController,
  changeProfileImage,
  changeSignatureImage,
  updateStudentDetailsController,
  semesterAdmissionController,
  newAdmissionController,
  submitVerificationDocument,
} = require('../controller/student_controller');
const {
  studentRegistrationValidator,
  studentLoginValidation,
  updateStudentDetailsValidation,
  studentSemesterAdmissionValidation,
  studentNewAdmissionValidation,
} = require('../middleware/student_validation_sanitization');
const { isAuthenticStudent } = require('../middleware/authentication');

const router = Router();


// POST student registration.
router.post('/registration', studentRegistrationValidator, registrationController);

// POST student login.
router.post('/login', studentLoginValidation, loginController);

// POST change student profile image.
router.put('/profileimage/change', isAuthenticStudent, changeProfileImage);

// POST change student signature image.
router.put('/signature/change', isAuthenticStudent, changeSignatureImage);

// POST student update
router.put('/update', isAuthenticStudent, updateStudentDetailsValidation, updateStudentDetailsController);

// POST create semester
router.post('/semester/new', isAuthenticStudent, studentSemesterAdmissionValidation, semesterAdmissionController);

// POST new  admission
router.post('/admission/new', isAuthenticStudent, studentNewAdmissionValidation, newAdmissionController);

// POST verification documents
router.post('/admission/semester/:id/document', isAuthenticStudent, submitVerificationDocument);

module.exports = router;
