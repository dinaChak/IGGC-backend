const {
  login,
  registration,
  updateStudentInfo,
  updateStudentProfile,
  updateStudentName,
} = require('./student_registration_login');
const {
  semesterAdmission,
  capturePayment,
  getStudentSemesters,
} = require('./student_semester_admission');
const { uploadProfileImage, uploadStudentSignature, uploadVerificationDocument } = require('./document_uploads');

module.exports = {
  registration,
  login,
  updateStudentInfo,
  updateStudentProfile,
  updateStudentName,
  semesterAdmission,
  capturePayment,
  getStudentSemesters,
  uploadProfileImage,
  uploadStudentSignature,
  uploadVerificationDocument,
};
