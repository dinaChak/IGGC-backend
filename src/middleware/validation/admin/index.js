const { loginValidation } = require('./authentication');
const {
  sessionValidation,
  admissionValidation,
} = require('./admission_session');
const {
  createBranchValidation,
  updateBranchValidation,
} = require('./branch');
const {
  streamValidation,
} = require('./stream');
const {
  departmentValidation,
} = require('./department');
const {
  subjectValidation,
  paperValidation,
} = require('./subject');
const {
  subjectRuleValidation,
} = require('./subject_rule');
const {
  syllabusValidation,
} = require('./syllabus');
const {
  verifyStudentValidation,
  updateStudentSemesterInternalValidation,
  updateStudentSemesterExternalValidation,
  updateStudentRollNoValidation,
  updateStudentSubjectCombinationValidation,
  updateStudentValidation,
} = require('./student');
const { bulletinValidation } = require('./bulletin');
const {
  photoFieldsValidation,
} = require('./photo');
const {
  facultyValidation,
} = require('./faculty');
const {
  administrationBranchValidation,
  administrationBranchStaffValidation,
} = require('./administration_branch');
const {
  cellValidation,
} = require('./cell');
const {
  infrastructureFacilityValidation,
} = require('./infrastructure_facility');
const {
  newsletterValidation,
} = require('./newsletter');
const {
  principalExists,
  principalValidation,
} = require('./principal');
const {
  collegeProfileExists,
  collegeProfileValidation,
} = require('./college_profile');
const {
  uploadValidation,
} = require('./upload');
const {
  minuteValidation,
  aqarValidation,
} = require('./iqac');
const {
  admissionNewValidation,
  admissionDatesValidation,
} = require('./admission_new');
const {
  massSMSValidation,
  singleSMSValidation,
  manySMSValidation,
} = require('./mass_SMS');
const {
  marqueeValidation,
} = require('./marquee');
const { updateAcademicDetailValidation } = require('./update_academic_detail');

module.exports = {
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
  updateStudentSubjectCombinationValidation,
  updateStudentValidation,
  bulletinValidation,
  photoFieldsValidation,
  streamValidation,
  departmentValidation,
  facultyValidation,
  administrationBranchValidation,
  administrationBranchStaffValidation,
  cellValidation,
  infrastructureFacilityValidation,
  newsletterValidation,
  principalExists,
  principalValidation,
  collegeProfileExists,
  collegeProfileValidation,
  uploadValidation,
  minuteValidation,
  aqarValidation,
  admissionNewValidation,
  admissionDatesValidation,
  massSMSValidation,
  singleSMSValidation,
  manySMSValidation,
  marqueeValidation,
  updateAcademicDetailValidation,
};
