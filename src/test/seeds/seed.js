const {
  Types
} = require('mongoose');
const faker = require('faker');

const {
  Branch
} = require('../../models/branch');
const {
  Student
} = require('../../models/student');


const branches = [{
    title: 'arts',
    _id: Types.ObjectId()
  },
  {
    title: 'commerce',
    _id: Types.ObjectId()
  },
  {
    title: 'science',
    _id: Types.ObjectId()
  }
];


const populateBranches = async () => {
  try {
    await Branch.deleteMany({});
    await Branch.insertMany(branches);
  } catch (error) {
    throw error;
  }
};


const students = [
  {
  _id: Types.ObjectId(),
  email: 'test1@example.com',
  password: faker.internet.password(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  dateOfBirth: faker.date.past(),
  gender: Math.random() < 0.5 ? 'male' : 'female',
  phoneNumber:  Array(10).fill().map(_ => Math.floor(Math.random() * 9)).join(''),
  branch: branches[Math.floor(Math.random() * branches.length)]["_id"]
},
{
  _id: Types.ObjectId(),
  email: 'test2@example.com',
  password: faker.internet.password(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  dateOfBirth: faker.date.past(),
  gender: Math.random() < 0.5 ? 'male' : 'female',
  phoneNumber:  Array(10).fill().map(_ => Math.floor(Math.random() * 9)).join(''),
  branch: branches[Math.floor(Math.random() * branches.length)]["_id"]
}
];


const populateStudents = async () => {
  try {
    await Student.deleteMany({});
    for (let i = 0; i < students.length; i++) {
      const student = new Student(students[i]);
      await student.save();
    }
    // await Student.insertMany(students);
  } catch (error) {
    throw error;
  }
};


module.exports = {
  populateBranches,
  populateStudents,
  branches,
  students
};