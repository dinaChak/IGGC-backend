const { Router } = require('express');

const {
  getSessions,
  getSession,
  getBranches,
  getCurrentSession,
  getCurrentAdmission,
  getSubjects,
  getAllSubject,
  getSubject,
  getSubjectRules,
  getSyllabuses,
  getSyllabus,
  getCurrentSessionAndCurrentAdmission,
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
} = require('../controller/info_new');

const router = Router();

router.get(
  '/sessions',
  getSessions,
);

router.get(
  '/sessions/:id',
  getSession,
);

router.get(
  '/current-session',
  getCurrentSession,
);

router.get(
  '/current-session/current-admission',
  getCurrentSessionAndCurrentAdmission,
);

router.get(
  '/current-admission',
  getCurrentAdmission,
);

router.get(
  '/branches',
  getBranches,
);

router.get(
  '/subjects',
  getSubjects,
);

router.get(
  '/subjects/all',
  getAllSubject,
);

router.get(
  '/subjects/:id',
  getSubject,
);

router.get(
  '/subject_rules',
  getSubjectRules,
);

router.get(
  '/syllabuses',
  getSyllabuses,
);
router.get(
  '/syllabuses/:id',
  getSyllabus,
);

router.get(
  '/bulletins',
  getBulletins,
);

router.get(
  '/bulletins/:id',
  getBulletin,
);

router.get(
  '/photos',
  getPhotos,
);

router.get(
  '/streams',
  getStreams,
);

router.get(
  '/streams/:id',
  getStream,
);

router.get(
  '/departments',
  getDepartments,
);

router.get(
  '/departments/:id',
  getDepartment,
);

router.get(
  '/faculties',
  getFaculties,
);

router.get(
  '/faculties/:id',
  getFaculty,
);

router.get(
  '/administration_branches',
  getAdministrationBranches,
);

router.get(
  '/administration_branches/:id',
  getAdministrationBranch,
);

router.get(
  '/cells',
  getCells,
);

router.get(
  '/cells/:id',
  getCell,
);

router.get(
  '/infrastructure_and_facilities',
  getInfrastructureFacilities,
);

router.get(
  '/infrastructure_and_facilities/:id',
  getInfrastructureFacility,
);

router.get(
  '/newsletters',
  getNewsletters,
);

router.get(
  '/newsletters/:id',
  getNewsletter,
);

router.get(
  '/principal',
  getPrincipal,
);

router.get(
  '/college_profile',
  getCollegeProfile,
);

router.get(
  '/uploads',
  getUploads,
);

router.get(
  '/new/admission',
  getAdmission,
);

router.get(
  '/iqac',
  getIqac,
);

module.exports = router;
