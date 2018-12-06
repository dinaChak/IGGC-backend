// @ts-check
const { Router } = require('express');

const {
  registrationController,
  loginController,
  createBranchController,
  createAdmission,
  getStudentCount,
  getNewApplicantCount,
  getApplicants,
  getStudentInstanceWithId,
  updateStudentInstanceValidationStatusWidthId,
} = require('../controller/admin_controller');
const {
  adminRegistrationValidation,
  adminLoginValidation,
  createBranchValidation,
  createAdmissionValidation,
  updateStudentInstanceValidationStatusValidation,
} = require('../middleware/admin_validation_and_sanitization');
const { isAuthenticAdminRoleAdmin } = require('../middleware/authentication');

const router = Router();

// POST create new Branch
router.post('/branch/create', isAuthenticAdminRoleAdmin, createBranchValidation, createBranchController);

// POST create new admission
router.put('/admission/create', isAuthenticAdminRoleAdmin, createAdmissionValidation, createAdmission);


// POST Register new Admin
router.post('/register', adminRegistrationValidation, registrationController);

// POST admin login
router.post('/login', adminLoginValidation, loginController);

// GET student count
router.get('/student/count', isAuthenticAdminRoleAdmin, getStudentCount);

// GET new applicant count
router.get('/applicant/count', isAuthenticAdminRoleAdmin, getNewApplicantCount);

// GET new applicants
router.get('/applicants', isAuthenticAdminRoleAdmin, getApplicants);

// GET studentInstance with id
router.get('/student_instance/:id', isAuthenticAdminRoleAdmin, getStudentInstanceWithId);

// PUT studentInstance validationStatus with id
router.put('/student_instance/:id/status', isAuthenticAdminRoleAdmin, updateStudentInstanceValidationStatusValidation, updateStudentInstanceValidationStatusWidthId);

module.exports = router;
