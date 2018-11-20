// @ts-check
const {
  Types,
} = require('mongoose');
const faker = require('faker');

const { Student } = require('../../models/student');
const { Admin } = require('../../models/admin');
const { Branch } = require('../../models/branch');
const { Admission } = require('../../models/admission');

const admins = [
  {
    _id: Types.ObjectId(),
    name: faker.internet.userName(),
    password: faker.internet.password(),
    role: 'admin',
  },
  {
    _id: Types.ObjectId(),
    name: faker.internet.userName(),
    password: faker.internet.password(),
    role: 'staff',
  },
];

const populateAdmins = async () => {
  await Promise.all(admins.map(admin => new Admin(admin).save()));
};


const branches = [{
  title: 'arts',
  _id: Types.ObjectId(),
},
{
  title: 'commerce',
  _id: Types.ObjectId(),
},
{
  title: 'science',
  _id: Types.ObjectId(),
},
];


const populateBranches = async () => {
  await Branch.insertMany(branches);
};


const students = [
  {
    _id: Types.ObjectId(),
    email: 'test1@example.com',
    password: faker.internet.password(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    dateOfBirth: faker.date.past(),
    gender: Math.random() < 0.5 ? 'male' : 'female',
    phoneNumber: Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join(''),
    // eslint-disable-next-line
    branch: branches[Math.floor(Math.random() * branches.length)]._id,
  },
  {
    _id: Types.ObjectId(),
    email: 'test2@example.com',
    password: faker.internet.password(),
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    dateOfBirth: faker.date.past(),
    gender: Math.random() < 0.5 ? 'male' : 'female',
    phoneNumber: Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join(''),
    // eslint-disable-next-line
    branch: branches[Math.floor(Math.random() * branches.length)]._id,
  },
];


const populateStudents = async () => {
  await Promise.all(students.map(student => new Student(student).save()));
};

const admission = {
  openingDate: faker.date.future(),
  closingDate: faker.date.future(),
  semester: 'even',
};

const populateAdmission = async () => {
  await new Admission(admission).save();
};


module.exports = {
  populateAdmins,
  populateBranches,
  populateStudents,
  populateAdmission,
  admins,
  branches,
  students,
  admission,
};
