// @ts-check
const mongoose = require('mongoose');
const faker = require('faker');

const { Branch } = require('../models/branch');
const { Semester } = require('../models/semester');
const { Admission } = require('../models/admission');
const { Session } = require('../models/session');
const { Student } = require('../models/student');
const { StudentInstance } = require('../models/studentInstance');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/IGGC_DEV', {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const createStudent = branch => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  fatherName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  motherName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  dateOfBirth: faker.date.past(),
  gender: Math.random() < 0.5 ? 'male' : 'female',
  phoneNumber: Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join(''),
  address: {
    present: `${faker.address.streetAddress()} ${faker.address.city()}`,
    permanent: `${faker.address.streetAddress()} ${faker.address.city()}`,
  },
  religion: 'hindu',
  category: 'st',
  nationality: 'indian',
  profileImage: faker.image.avatar(),
  signatureImage: faker.image.image(),
  branch,
});

const createSemester = (studentId, semesterNo, session, branch) => ({
  number: semesterNo,
  student: studentId,
  branch,
  session,
});

const createStudentInstance = (student, semester, semesterNo, branch, name) => ({
  student,
  semester,
  semesterNo,
  branch,
  name,
});


// populate Applicant
const populateOneApplicant = async (branches, session, semesters) => {
  const branch = branches[Math.floor(Math.random() * branches.length)].title;
  const semesterNo = semesters[Math.floor(Math.random() * semesters.length)];
  const student = new Student(createStudent(branch));
  // eslint-disable-next-line
  const semester = new Semester(createSemester(student._id, semesterNo, session._id, branch));
  // eslint-disable-next-line
  const studentInstance = new StudentInstance(createStudentInstance(student._id, semester._id, semesterNo, branch, student.name));
  await Promise.all([student.save(), semester.save(), studentInstance.save()]);
};

// eslint-disable-next-line
const populateManyApplicant = async () => {
  try {
    const branches = await Branch.find();
    const session = (await Session.find().sort('to'))[0];
    // const admission = (await Admission.find())[0];
    const semesters = [1, 3, 5];
    await Promise
      .all(Array(500).fill(0).map(() => populateOneApplicant(branches, session, semesters)));
    console.log('populated');
  } catch (error) {
    console.error(error);
  }
};

// populate Students
const populateOneStudent = async (branches, session, semesters) => {
  const branch = branches[Math.floor(Math.random() * branches.length)].title;
  const semesterNo = semesters[Math.floor(Math.random() * semesters.length)];
  const student = new Student(createStudent(branch));
  // eslint-disable-next-line
  const semester = new Semester(createSemester(student._id, semesterNo, session._id, branch));
  const studentInstance = new StudentInstance({
  // eslint-disable-next-line
    ...createStudentInstance(student._id, semester._id, semesterNo, branch, student.name),
    verificationStatus: 'verified',
    fees: 'paid',
    newRegistration: false,
  });
  await Promise.all([student.save(), semester.save(), studentInstance.save()]);
};

// eslint-disable-next-line
const populateManyStudent = async () => {
  try {
    const branches = await Branch.find();
    const session = (await Session.find().sort('to'))[0];
    // const admission = (await Admission.find())[0];
    const semesters = [1, 3, 5];
    await Promise
      .all(Array(500).fill(0).map(() => populateOneStudent(branches, session, semesters)));
    console.log('populated');
  } catch (error) {
    console.error(error);
  }
};

populateManyStudent();
// populateManyApplicant();

// populateMany();
