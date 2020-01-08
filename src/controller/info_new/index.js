const {
  getSessions,
  getSession,
  getCurrentSession,
  getCurrentAdmission,
  getCurrentSessionAndCurrentAdmission,
} = require('./session_admission');
const {
  getSubjects,
  getAllSubject,
  getSubject,
} = require('./subject');
const {
  getSubjectRules,
} = require('./subject_rule');
const {
  getSyllabuses,
  getSyllabus,
} = require('./syllabus');
const {
  getBranches,
} = require('./branches');
const {
  getBulletins,
  getBulletin,
} = require('./bulletin');
const { getPhotos } = require('./photo');
const {
  getStreams,
  getStream,
} = require('./stream');
const {
  getDepartment,
  getDepartments,
} = require('./department');
const {
  getFaculty,
  getFaculties,
} = require('./faculty');
const {
  getAdministrationBranches,
  getAdministrationBranch,
} = require('./administration_branch');
const {
  getCells,
  getCell,
} = require('./cell');
const {
  getInfrastructureFacilities,
  getInfrastructureFacility,
} = require('./infrastructure_facility');
const {
  getNewsletters,
  getNewsletter,
} = require('./newsletter');
const {
  getPrincipal,
} = require('./principal');
const {
  getCollegeProfile,
} = require('./college_profile');
const {
  getUploads,
} = require('./upload');
const {
  getAdmission,
} = require('./admission_new');
const {
  getIqac,
} = require('./iqac');
const {
  studentCount,
  studentCountByBranch,
} = require('./student');
const {
  getSMSCount,
} = require('./sms');
const {
  getMarquees,
} = require('./marquee');
const { getAppName } = require('./desktop_app');

module.exports = {
  getSessions,
  getSession,
  getBranches,
  getCurrentSession,
  getCurrentAdmission,
  getCurrentSessionAndCurrentAdmission,
  getSubjects,
  getAllSubject,
  getSubject,
  getSubjectRules,
  getSyllabuses,
  getSyllabus,
  getBulletins,
  getBulletin,
  getPhotos,
  getStreams,
  getStream,
  getDepartment,
  getDepartments,
  getFaculty,
  getFaculties,
  getAdministrationBranches,
  getAdministrationBranch,
  getCell,
  getCells,
  getInfrastructureFacilities,
  getInfrastructureFacility,
  getNewsletters,
  getNewsletter,
  getPrincipal,
  getCollegeProfile,
  getUploads,
  getAdmission,
  getIqac,
  studentCount,
  studentCountByBranch,
  getSMSCount,
  getMarquees,
  getAppName,
};
