const mongoose = require('mongoose');
const faker = require('faker');

const { Faculty } = require('../models/faculty');
const { Department } = require('../models/department');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/IGGC_DEV', {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


const facultyObject = (department, hod = false) => ({
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  phone: Array(10).fill(0).map(() => Math.floor(Math.random() * 9)).join(''),
  email: faker.internet.email(),
  address: `${faker.address.streetAddress()} ${faker.address.city()}`,
  img: faker.image.avatar(),
  hod,
  department,
  position: 'Assistant Professor',
  education_qualification: 'Ph. D',
});

const populateFaculties = async () => {
  try {
    await Faculty.deleteMany({});
    const departments = await Department.find({}).select('title');
    let facultiesObj = [];
    departments.forEach((department) => {
      facultiesObj = [
        ...facultiesObj,
        // eslint-disable-next-line
        ...[...Array(4).keys()].map((_, i) => facultyObject(department._id, i === 0)),
      ];
    });
    await Faculty.insertMany(facultiesObj);
    db.close();
  } catch (error) {
    console.error(error);
  }
};

populateFaculties();
