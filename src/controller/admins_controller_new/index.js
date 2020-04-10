const {
  registration,
  login,
} = require('./login');
const {
  createSession,
  updateSession,
  createAdmission,
  updateAdmission,
} = require('./admission_session');
const {
  createBranch,
  updateBranch,
  deleteBranch,
} = require('./branch');
const {
  createStream,
  updateStream,
  deleteStream,
} = require('./stream');
const {
  createDepartment,
  updateDepartment,
  deleteDepartment,
} = require('./department');
const {
  createFaculty,
  updateFaculty,
  updateFacultyPhoto,
  deleteFaculty,
} = require('./faculty');
const {
  createAdministrationBranch,
  updateAdministrationBranch,
  deleteAdministrationBranch,
  createAdministrationBranchStaff,
  updateAdministrationBranchStaff,
  deleteAdministrationBranchStaff,
} = require('./administration_branch');
const {
  createSubject,
  updateSubject,
  deleteSubject,
  createPaper,
  updatePaper,
  deletePaper,
} = require('./subject');
const {
  createSubjectRule,
  updateSubjectRule,
  deleteSubjectRule,
} = require('./subject_rule');
const {
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
} = require('./syllabus');
// const {
//   getStudents,
//   getSemesters,
//   getSemester,
//   getStudent,
//   verifyApplicant,
//   getStudentSemesters,
//   updateStudentSemesterInternal,
//   updateStudentSemesterExternal,
//   updateStudentRollNo,
//   deleteStudent,
// } = require('./student');
const {
  getStudents,
  getAllStudents,
  getStudent,
  verifyApplicant,
  admissionCompletedApplicant,
  updateStudentSubjectCombination,
  updateStudent,
  updateStudentClassRollNo,
  verifySelectedApplicants,
  admissionCompletedSelectedApplicants,
  deleteStudent,
} = require('./student_new');
const {
  createBulletin,
  updateBulletin,
  deleteBulletin,
} = require('./bulletin');
const {
  createPhoto,
  updatePhoto,
  uploadPhoto,
  deletePhoto,
} = require('./photo');
const {
  createCell,
  updateCell,
  deleteCell,
} = require('./cell');
const {
  createInfrastructureFacility,
  updateInfrastructureFacility,
  deleteInfrastructureFacility,
} = require('./infrastructure_facility');
const {
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
} = require('./newsletter');
const { downloadXls } = require('./download_xl');
const {
  createPrincipal,
  updatePrincipal,
  deletePrincipal,
} = require('./principal');
const {
  createCollegeProfile,
  updateCollegeProfile,
  deleteCollegeProfile,
} = require('./college_profile');
const {
  createUpload,
  updateUpload,
  deleteUpload,
} = require('./upload');
const {
  createMinute,
  updateMinute,
  deleteMinute,
  createAqar,
  updateAqar,
  deleteAqar,
  updateIQACComposition,
} = require('./iqac');
const {
  updateAdmissionFeeStructure,
  updateAdmissionInstruction,
  updateAdmissionHostel,
  updateAdmissionDates,
} = require('./admission_new');
const {
  downloadApplicantSheet,
  downloadStudentsSheet,
  downloadFacultiesSheet,
  readStudentXL,
} = require('./download_excels');
const {
  sendMassSMS,
  sendSingleSMS,
  sendManySMS,
} = require('./mass_SMS');
const {
  createMarquee,
  updateMarquee,
  deleteMarquee,
} = require('./marquee');
const { downloadDesktopAppLatest } = require('./desktop_app');
const { updateStudentAcademicDetails } = require('./academic_details');


module.exports = {
  registration,
  login,
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
  updateSubjectRule,
  deleteSubjectRule,
  createSyllabus,
  updateSyllabus,
  deleteSyllabus,
  getStudents,
  getAllStudents,
  getStudent,
  verifyApplicant,
  verifySelectedApplicants,
  admissionCompletedSelectedApplicants,
  admissionCompletedApplicant,
  updateStudentSubjectCombination,
  updateStudent,
  updateStudentClassRollNo,
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
  createAdministrationBranch,
  updateAdministrationBranch,
  deleteAdministrationBranch,
  createAdministrationBranchStaff,
  updateAdministrationBranchStaff,
  deleteAdministrationBranchStaff,
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
  updateAdmissionInstruction,
  updateAdmissionFeeStructure,
  updateAdmissionHostel,
  updateAdmissionDates,
  downloadApplicantSheet,
  downloadStudentsSheet,
  downloadFacultiesSheet,
  readStudentXL,
  sendMassSMS,
  sendSingleSMS,
  sendManySMS,
  createMarquee,
  updateMarquee,
  deleteMarquee,
  downloadDesktopAppLatest,
  updateStudentAcademicDetails,
};
