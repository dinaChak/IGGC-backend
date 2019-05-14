const { Router } = require('express');
const path = require('path');

const {
  login,
  registration,
  createSession,
  updateSession,
  createAdmission,
  updateAdmission,
  createBranch,
  updateBranch,
  deleteBranch,
  createSubject,
  updateSubject,
  deleteSubject,
  createPaper,
  updatePaper,
  deletePaper,
  createSubjectRule,
  deleteSubjectRule,
  updateSubjectRule,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
  getStudents,
  getStudent,
  getSemesters,
  getSemester,
  verifyApplicant,
  getStudentSemesters,
  updateStudentSemesterInternal,
  updateStudentSemesterExternal,
  updateStudentRollNo,
  deleteStudent,
  createBulletin,
  updateBulletin,
  deleteBulletin,
  createPhoto,
  updatePhoto,
  uploadPhoto,
  deletePhoto,
  downloadXls,
  createStream,
  updateStream,
  deleteStream,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  createFaculty,
  updateFaculty,
  updateFacultyPhoto,
  deleteFaculty,
  createCell,
  updateCell,
  deleteCell,
  createInfrastructureFacility,
  updateInfrastructureFacility,
  deleteInfrastructureFacility,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  createPrincipal,
  updatePrincipal,
  deletePrincipal,
  createCollegeProfile,
  updateCollegeProfile,
  deleteCollegeProfile,
  createAdministrationBranch,
  updateAdministrationBranch,
  deleteAdministrationBranch,
  createAdministrationBranchStaff,
  updateAdministrationBranchStaff,
  deleteAdministrationBranchStaff,
  createUpload,
  updateUpload,
  deleteUpload,
  createMinute,
  updateMinute,
  deleteMinute,
  createAqar,
  updateAqar,
  deleteAqar,
  updateIQACComposition,
  updateAdmissionFeeStructure,
  updateAdmissionInstruction,
  updateAdmissionHostel,
  updateAdmissionDates,
} = require('../controller/admins_controller_new');

const {
  loginValidation,
  createBranchValidation,
  updateBranchValidation,
  sessionValidation,
  admissionValidation,
  subjectValidation,
  paperValidation,
  subjectRuleValidation,
  syllabusValidation,
  verifyStudentValidation,
  updateStudentSemesterInternalValidation,
  updateStudentSemesterExternalValidation,
  updateStudentRollNoValidation,
  bulletinValidation,
  photoFieldsValidation,
  streamValidation,
  departmentValidation,
  facultyValidation,
  cellValidation,
  infrastructureFacilityValidation,
  newsletterValidation,
  principalExists,
  principalValidation,
  collegeProfileExists,
  collegeProfileValidation,
  administrationBranchValidation,
  administrationBranchStaffValidation,
  uploadValidation,
  minuteValidation,
  aqarValidation,
  admissionNewValidation,
  admissionDatesValidation,
} = require('../middleware/validation/admin');
const {
  isAuthenticAdminRoleAdmin,
} = require('../middleware/authentication');
const localImgMulter = require('../middleware/uploads/image_local');
const localPDFMulter = require('../middleware/uploads/pdf_local');
const localFileMulter = require('../middleware/uploads/pdf_image_local');

const localFileProcessor = localFileMulter({
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  baseDir: 'files',
  fieldName: 'file',
});

const localSiteImgProcessor = localImgMulter({
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  baseDir: 'images',
  fieldName: 'photo',
  imageOption: [1200, 800, { fit: 'inside' }],
});

const localProfileImgProcessor = localImgMulter({
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  baseDir: 'images',
  fieldName: 'photo',
  imageOption: [350, 400, { fit: 'inside' }],
});

const localPDFProcessor = localPDFMulter({
  baseDir: 'files',
  basePath: path.join(__dirname, '..', '..', 'uploads'),
  fieldName: 'pdf',
});


const router = Router();

router.post(
  '/registration',
  registration,
);

router.post(
  '/login',
  loginValidation,
  login,
);

router.post(
  '/branch',
  isAuthenticAdminRoleAdmin,
  createBranchValidation,
  createBranch,
);

router.put(
  '/branch/:id',
  isAuthenticAdminRoleAdmin,
  updateBranchValidation,
  updateBranch,
);

router.delete(
  '/branch/:id',
  isAuthenticAdminRoleAdmin,
  deleteBranch,
);

router.post(
  '/session',
  isAuthenticAdminRoleAdmin,
  sessionValidation,
  createSession,
);

router.put(
  '/session/:id',
  isAuthenticAdminRoleAdmin,
  sessionValidation,
  updateSession,
);

router.post(
  '/session/:id/admission',
  isAuthenticAdminRoleAdmin,
  admissionValidation,
  createAdmission,
);

router.put(
  '/admission/:id',
  isAuthenticAdminRoleAdmin,
  admissionValidation,
  updateAdmission,
);

router.post(
  '/subject',
  isAuthenticAdminRoleAdmin,
  subjectValidation,
  createSubject,
);

/**
 * Subject
 */
router.put(
  '/subject/:id',
  isAuthenticAdminRoleAdmin,
  subjectValidation,
  updateSubject,
);

router.delete(
  '/subject/:id',
  isAuthenticAdminRoleAdmin,
  deleteSubject,
);

// paper
router.post(
  '/subject/:id/paper',
  isAuthenticAdminRoleAdmin,
  paperValidation,
  createPaper,
);

router.put(
  '/subject/:id/paper/:paperId',
  isAuthenticAdminRoleAdmin,
  paperValidation,
  updatePaper,
);

router.delete(
  '/subject/:id/paper/:paperId',
  isAuthenticAdminRoleAdmin,
  deletePaper,
);

/**
 * Subject Rule
 */
router.post(
  '/subject_rule',
  isAuthenticAdminRoleAdmin,
  subjectRuleValidation,
  createSubjectRule,
);

router.put(
  '/subject_rule/:id',
  isAuthenticAdminRoleAdmin,
  subjectRuleValidation,
  updateSubjectRule,
);

router.delete(
  '/subject_rule/:id',
  isAuthenticAdminRoleAdmin,
  deleteSubjectRule,
);

/**
 * Syllabus
 */
router.post(
  '/syllabus',
  isAuthenticAdminRoleAdmin,
  localPDFProcessor.fieldValidationRequired.bind(localPDFProcessor),
  syllabusValidation,
  createSyllabus,
);

router.put(
  '/syllabus/:id',
  isAuthenticAdminRoleAdmin,
  localPDFProcessor.fieldValidationOptional.bind(localPDFProcessor),
  syllabusValidation,
  updateSyllabus,
);

router.delete(
  '/syllabus/:id',
  isAuthenticAdminRoleAdmin,
  deleteSyllabus,
);

router.get(
  '/students',
  isAuthenticAdminRoleAdmin,
  getStudents,
);

router.get(
  '/students/:id',
  isAuthenticAdminRoleAdmin,
  getStudent,
);

router.put(
  '/students/:id/roll-no',
  isAuthenticAdminRoleAdmin,
  updateStudentRollNoValidation,
  updateStudentRollNo,
);

router.delete(
  '/students/:id',
  isAuthenticAdminRoleAdmin,
  deleteStudent,
);

router.get(
  '/students/:id/semesters',
  isAuthenticAdminRoleAdmin,
  getStudentSemesters,
);

router.get(
  '/download/students',
  isAuthenticAdminRoleAdmin,
  downloadXls,
);


router.get(
  '/semesters',
  isAuthenticAdminRoleAdmin,
  getSemesters,
);

router.get(
  '/semesters/:id',
  isAuthenticAdminRoleAdmin,
  getSemester,
);

router.put(
  '/semesters/:id/internal',
  isAuthenticAdminRoleAdmin,
  updateStudentSemesterInternalValidation,
  updateStudentSemesterInternal,
);

router.put(
  '/semesters/:id/external',
  isAuthenticAdminRoleAdmin,
  updateStudentSemesterExternalValidation,
  updateStudentSemesterExternal,
);

router.put(
  '/applicant/:id',
  isAuthenticAdminRoleAdmin,
  verifyStudentValidation,
  verifyApplicant,
);

/**
 * Bulletin
 */
router.post(
  '/bulletin',
  isAuthenticAdminRoleAdmin,
  localPDFProcessor.fieldValidationRequired.bind(localPDFProcessor),
  bulletinValidation,
  createBulletin,
);

router.put(
  '/bulletin/:id',
  isAuthenticAdminRoleAdmin,
  localPDFProcessor.fieldValidationRequired.bind(localPDFProcessor),
  bulletinValidation,
  updateBulletin,
);

router.delete(
  '/bulletin/:id',
  isAuthenticAdminRoleAdmin,
  deleteBulletin,
);

router.post(
  '/photo',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationRequired.bind(localSiteImgProcessor),
  photoFieldsValidation,
  createPhoto,
);

router.put(
  '/photo/:id',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationOptional.bind(localSiteImgProcessor),
  photoFieldsValidation,
  updatePhoto,
);

router.put(
  '/photo/:id/upload',
  isAuthenticAdminRoleAdmin,
  uploadPhoto,
);

router.delete(
  '/photo/:id',
  isAuthenticAdminRoleAdmin,
  deletePhoto,
);

/**
 * Stream
 */
router.post(
  '/stream',
  isAuthenticAdminRoleAdmin,
  streamValidation,
  createStream,
);

router.put(
  '/stream/:id',
  isAuthenticAdminRoleAdmin,
  streamValidation,
  updateStream,
);

router.delete(
  '/stream/:id',
  isAuthenticAdminRoleAdmin,
  deleteStream,
);

/**
 * Department
 */
router.post(
  '/department',
  isAuthenticAdminRoleAdmin,
  departmentValidation,
  createDepartment,
);

router.put(
  '/department/:id',
  isAuthenticAdminRoleAdmin,
  departmentValidation,
  updateDepartment,
);

router.delete(
  '/department/:id',
  isAuthenticAdminRoleAdmin,
  deleteDepartment,
);

/**
 * Faculty
 */

router.post(
  '/faculty',
  isAuthenticAdminRoleAdmin,
  localProfileImgProcessor.fieldValidationRequired.bind(localProfileImgProcessor),
  facultyValidation,
  createFaculty,
);

router.put(
  '/faculty/:id',
  isAuthenticAdminRoleAdmin,
  localProfileImgProcessor.fieldValidationOptional.bind(localProfileImgProcessor),
  facultyValidation,
  updateFaculty,
);

router.put(
  '/faculty/:id/upload',
  isAuthenticAdminRoleAdmin,
  updateFacultyPhoto,
);

router.delete(
  '/faculty/:id',
  isAuthenticAdminRoleAdmin,
  deleteFaculty,
);


/**
 * CELL
 */
router.post(
  '/cell',
  isAuthenticAdminRoleAdmin,
  cellValidation,
  createCell,
);

router.put(
  '/cell/:id',
  isAuthenticAdminRoleAdmin,
  cellValidation,
  updateCell,
);

router.delete(
  '/cell/:id',
  isAuthenticAdminRoleAdmin,
  deleteCell,
);

router.post(
  '/infrastructure_and_facility',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationOptional.bind(localSiteImgProcessor),
  infrastructureFacilityValidation,
  createInfrastructureFacility,
);

router.put(
  '/infrastructure_and_facility/:id',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationOptional.bind(localSiteImgProcessor),
  infrastructureFacilityValidation,
  updateInfrastructureFacility,
);

router.delete(
  '/infrastructure_and_facility/:id',
  isAuthenticAdminRoleAdmin,
  deleteInfrastructureFacility,
);

/**
 * Principal
 */
router.post(
  '/principal',
  isAuthenticAdminRoleAdmin,
  localProfileImgProcessor.fieldValidationRequired.bind(localProfileImgProcessor),
  principalExists,
  principalValidation,
  createPrincipal,
);

router.put(
  '/principal/:id',
  isAuthenticAdminRoleAdmin,
  localProfileImgProcessor.fieldValidationOptional.bind(localProfileImgProcessor),
  principalValidation,
  updatePrincipal,
);

router.delete(
  '/principal/:id',
  isAuthenticAdminRoleAdmin,
  deletePrincipal,
);

/**
 * College Profile
 */
router.post(
  '/college_profile',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationRequired.bind(localSiteImgProcessor),
  collegeProfileExists,
  collegeProfileValidation,
  createCollegeProfile,
);

router.put(
  '/college_profile/:id',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationOptional.bind(localSiteImgProcessor),
  collegeProfileValidation,
  updateCollegeProfile,
);

router.delete(
  '/college_profile/:id',
  isAuthenticAdminRoleAdmin,
  deleteCollegeProfile,
);

/**
 * Administration Branch
 */
router.post(
  '/administration_branch',
  isAuthenticAdminRoleAdmin,
  administrationBranchValidation,
  createAdministrationBranch,
);

router.put(
  '/administration_branch/:id',
  isAuthenticAdminRoleAdmin,
  administrationBranchValidation,
  updateAdministrationBranch,
);

router.delete(
  '/administration_branch/:id',
  isAuthenticAdminRoleAdmin,
  deleteAdministrationBranch,
);

router.post(
  '/administration_branch/:id/staff',
  isAuthenticAdminRoleAdmin,
  administrationBranchStaffValidation,
  createAdministrationBranchStaff,
);

router.put(
  '/administration_branch/:id/staff/:staffId',
  isAuthenticAdminRoleAdmin,
  administrationBranchStaffValidation,
  updateAdministrationBranchStaff,
);

router.delete(
  '/administration_branch/:id/staff/:staffId',
  isAuthenticAdminRoleAdmin,
  deleteAdministrationBranchStaff,
);

/**
 * Upload
 */
router.post(
  '/upload',
  isAuthenticAdminRoleAdmin,
  localFileProcessor.fieldValidationRequired.bind(localFileProcessor),
  uploadValidation,
  createUpload,
);

router.put(
  '/upload/:id',
  isAuthenticAdminRoleAdmin,
  localFileProcessor.fieldValidationOptional.bind(localFileProcessor),
  uploadValidation,
  updateUpload,
);

router.delete(
  '/upload/:id',
  isAuthenticAdminRoleAdmin,
  deleteUpload,
);

/**
 * IQAC
 */
router.post(
  '/iqac/:id/minute',
  isAuthenticAdminRoleAdmin,
  minuteValidation,
  createMinute,
);

router.put(
  '/iqac/:id/minute/:minuteId',
  isAuthenticAdminRoleAdmin,
  minuteValidation,
  updateMinute,
);

router.delete(
  '/iqac/:id/minute/:minuteId',
  isAuthenticAdminRoleAdmin,
  deleteMinute,
);

router.post(
  '/iqac/:id/aqar',
  isAuthenticAdminRoleAdmin,
  aqarValidation,
  createAqar,
);

router.put(
  '/iqac/:id/aqar/:aqarId',
  isAuthenticAdminRoleAdmin,
  aqarValidation,
  updateAqar,
);

router.delete(
  '/iqac/:id/aqar/:aqarId',
  isAuthenticAdminRoleAdmin,
  deleteAqar,
);

router.put(
  '/iqac/:id/composition',
  isAuthenticAdminRoleAdmin,
  updateIQACComposition,
);

/**
 * Newsletter
 */
router.post(
  '/newsletter',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationOptional.bind(localSiteImgProcessor),
  newsletterValidation,
  createNewsletter,
);

router.put(
  '/newsletter/:id',
  isAuthenticAdminRoleAdmin,
  localSiteImgProcessor.fieldValidationOptional.bind(localSiteImgProcessor),
  newsletterValidation,
  updateNewsletter,
);

router.delete(
  '/newsletter/:id',
  isAuthenticAdminRoleAdmin,
  deleteNewsletter,
);

/**
 * Admission New
 */
router.put(
  '/new/admission/:id/instruction',
  isAuthenticAdminRoleAdmin,
  admissionNewValidation,
  updateAdmissionInstruction,
);

router.put(
  '/new/admission/:id/fee_structure',
  isAuthenticAdminRoleAdmin,
  admissionNewValidation,
  updateAdmissionFeeStructure,
);

router.put(
  '/new/admission/:id/hostel',
  isAuthenticAdminRoleAdmin,
  updateAdmissionHostel,
);

router.put(
  '/new/admission/:id/dates',
  isAuthenticAdminRoleAdmin,
  admissionDatesValidation,
  updateAdmissionDates,
);

module.exports = router;
