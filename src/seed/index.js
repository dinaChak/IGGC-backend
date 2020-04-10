require('dotenv').config();
const mongoose = require('mongoose');
const faker = require('faker');
const _ = require('lodash');

const { Admin } = require('../models/admin');
const { Branch } = require('../models/branch');
const { Session } = require('../models/session');
const { Admission } = require('../models/admission');
const { Subject } = require('../models/subject');
const { SubjectRule } = require('../models/subject_rule');
const { Student } = require('../models/student');
const { StudentInstance } = require('../models/studentInstance');
const { Semester } = require('../models/semester');


const { subjects, branchSubjects } = require('./subjects');
const { subjectRules } = require('./subject_rule');

mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.MONGODB_URI_DEV, {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


const admin = {
  name: 'admin',
  password: 'password123',
  role: 'admin',
};

const branches = [
  {
    title: 'b.a',
  },
  {
    title: 'b.com',
  },
  {
    title: 'b.sc',
  },
];

const admissions = [
  {
    _id: mongoose.Types.ObjectId(),
    semesterType: 'odd',
    openingDate: new Date('2018-12-26').toISOString(),
    closingDate: new Date('2019-02-27').toISOString(),
    branches: branches.map(branch => ({
      title: branch.title,
      semesterFees: [...Array(6).keys()]
        .map(x => x + 1)
        .filter(x => x % 2 !== 0)
        .map(x => ({
          semester: x,
          fees: 2000,
        })),
    })),
  },
];

const session = {
  _id: mongoose.Types.ObjectId(),
  from: new Date('2019-03-02').toISOString(),
  to: new Date('2020-03-02').toISOString(),
  // eslint-disable-next-line
  admissions: admissions.map(admission => admission._id),
};

const generateStudentObject = branch => ({
  _id: mongoose.Types.ObjectId(),
  phoneNumber: Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join(''),
  email: faker.internet.email(),
  password: faker.internet.password(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  dateOfBirth: faker.date.past(),
  gender: _.shuffle(['male', 'female', 'other'])[0],
  fatherName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  motherName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  religion: _.shuffle(['hindu', 'christian', 'muslim', 'buddhist', 'other'])[0],
  category: _.shuffle(['st', 'sc', 'obc', 'general'])[0],
  nationality: 'Indian',
  profileImage: faker.image.avatar(),
  signatureImage: faker.image.technics(),
  address: {
    present: `${faker.address.streetAddress()} ${faker.address.city()}`,
    permanent: `${faker.address.streetAddress()} ${faker.address.city()}`,
  },
  rollNumber: faker.finance.account(),
  branch: branch.title,
});

const generateSemesterObject = (
  semesterNo,
  studentId,
  branch,
  sessionId,
) => ({
  number: semesterNo,
  student: studentId,
  branch,
  session: sessionId,
  _id: mongoose.Types.ObjectId(),
  subjects: _.shuffle(branchSubjects[branch][semesterNo - 1]).slice(0, 4).map(subject => ({
    subject: {
      title: subject.title,
      code: subject.code,
    },
    internal: [...Array(3).keys()].map(x => ({
      number: x + 1,
    })),
  })),
});

const generateStudentInstanceObject = (
  studentId,
  semesterId,
  newReg,
  name,
  rollNumber,
  branch,
  currentSemester,
  admissionStatus,
  paymentStatus,
  feeAmount,
) => ({
  student: studentId,
  semester: semesterId,
  newRegistration: newReg,
  name,
  rollNumber,
  branch,
  current_semester: currentSemester,
  admission: {
    status: admissionStatus,
    documentImage: faker.image.technics(),
    payment: {
      status: paymentStatus,
      amount: feeAmount,
    },
  },
});

const populateStudent = async (
  newReg,
  number,
  semesterType,
  sessionId,
  admissionStatus,
  paymentStatus,
  feeAmount,
) => {
  const semesters = [...Array(6).keys()].map(x => x + 1).filter(x => (semesterType === 'odd' ? x % 2 !== 0 : x % 2 === 0));
  const obj = [...Array(number).keys()].reduce((acc) => {
    const branch = _.shuffle(branches)[0];
    const semester = _.shuffle(semesters)[0];
    const studentObject = generateStudentObject(branch);
    const semesterObject = generateSemesterObject(
      semester,
      // eslint-disable-next-line
      studentObject._id,
      branch.title,
      sessionId,
    );
    const studentInstancesObject = generateStudentInstanceObject(
      // eslint-disable-next-line
      studentObject._id,
      // eslint-disable-next-line
      semesterObject._id,
      newReg,
      studentObject.name,
      studentObject.rollNumber,
      branch.title,
      semester,
      admissionStatus,
      paymentStatus,
      feeAmount,
    );
    return {
      studentArr: acc.studentArr ? [...acc.studentArr, studentObject] : [],
      semesterArr: acc.semesterArr ? [...acc.semesterArr, semesterObject] : [],
      studentInstanceArr: acc.studentInstanceArr
        ? [...acc.studentInstanceArr, studentInstancesObject]
        : [],
    };
  }, {});
  await Student.insertMany(obj.studentArr);
  await Semester.insertMany(obj.semesterArr);
  await StudentInstance.insertMany(obj.studentInstanceArr);
};

const populatedSubjects = async () => {
  await Subject.insertMany(subjects);
};

const populatedSubjectRules = async () => {
  await SubjectRule.insertMany(subjectRules);
};

const main = async () => {
  try {
    // await db.dropDatabase();
    await new Admin(admin).save();
    await Branch.insertMany(branches);
    await Admission.insertMany(admissions);
    await new Session(session).save();
    await populatedSubjects();
    await populatedSubjectRules();
    // populate new Registration
    await populateStudent(
      true,
      1000,
      'odd',
      // eslint-disable-next-line
      session._id,
      'verification',
      'due',
      2000,
    );
    // populate students
    await populateStudent(
      false,
      5000,
      'odd',
      // eslint-disable-next-line
      session._id,
      'completed',
      'paid',
      2000,
    );
    db.close();
    console.log('populated');
  } catch (error) {
    db.close();
    console.log(error);
  }
};

main();
