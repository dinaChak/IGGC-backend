const mongoose = require('mongoose');
const faker = require('faker');
const path = require('path');
const fs = require('fs');

const { Student } = require('../models/student_new');

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});


const parseSubjects = async () => {
  try {
    const data = await readFile(path.join(__dirname, 'subjects_formatted.json'));
    const obj = JSON.parse(data);
    // console.log(Object.keys(obj));
    const subjects = Object.keys(obj);
    const branches = subjects.reduce((acc, curr) => ({
      ...acc,
      [obj[curr].branch]: [...acc[obj[curr].branch] || [], ...obj[curr].papers],
    }), {});
    return branches;
  } catch (error) {
    return '';
  }
};


const generateNumber = (number) => {
  const increment = () => {
    // eslint-disable-next-line no-param-reassign
    number += 1;
    return number;
  };
  return increment;
};

const randomIntFromInterval = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const generatePhoneNo = generateNumber(6123456789);

const generatePapers = (branch, semester, subjects) => {
  const papers = subjects[branch].filter(paper => String(semester) === paper.semester)
    .map(({ code, title }) => ({ code, title }));
  return papers.slice(0, randomIntFromInterval(4, 5));
};


const mapVerificationDocs = (semester) => {
  if (semester > 1) {
    return [{
      title: `Mark sheet of Semester ${semester}`,
      file: {
        path: faker.internet.avatar(),
        fileName: faker.name.findName(),
        baseDir: 'images',
        link: faker.internet.avatar(),
      },
    }];
  }
  return ['Certificate of Class-X', 'Mark Sheet Class-XII'].map(title => ({
    title,
    file: {
      path: faker.internet.avatar(),
      fileName: faker.name.findName(),
      baseDir: 'images',
      link: faker.internet.avatar(),
    },
  }));
};

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://iggc:qwerty1010@localhost/IGGC_DEV?authSource=admin', {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const studentObj = (branch, semester, subjects) => ({
  _id: mongoose.Types.ObjectId(),
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  date_of_birth: faker.date.past(),
  phone_number: generatePhoneNo(),
  profile_image: {
    path: faker.internet.avatar(),
    fileName: faker.name.findName(),
    baseDir: 'images',
    link: faker.internet.avatar(),
  },
  signature_image: {
    path: faker.internet.avatar(),
    fileName: faker.name.findName(),
    baseDir: 'images',
    link: faker.internet.avatar(),
  },
  email: faker.internet.email(),
  password: faker.internet.password(),
  gender: ['male', 'female', 'other'][randomIntFromInterval(0, 2)],
  fatherName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  motherName: `${faker.name.firstName()} ${faker.name.lastName()}`,
  religion: ['Christian', 'Hindu', 'Muslim', 'Other'][randomIntFromInterval(0, 3)],
  category: ['General', 'ST', 'SC', 'OBC'][randomIntFromInterval(0, 3)],
  nationality: 'India',
  presentAddress: {
    vill_town: faker.address.city(),
    ps_po: faker.address.city(),
    state: faker.address.state(),
    district: faker.address.city(),
    pin: faker.address.zipCode(),
  },
  permanentAddress: {
    vill_town: faker.address.city(),
    ps_po: faker.address.city(),
    state: faker.address.state(),
    district: faker.address.city(),
    pin: faker.address.zipCode(),
  },
  branch: String(branch).toLowerCase(),
  semester,
  subjects: generatePapers(branch, semester, subjects),
  verification_documents: mapVerificationDocs(semester),
  admissionStatus: ['applying', 'verification', 'verified'][randomIntFromInterval(0, 2)],
});

const main = async () => {
  try {
    const subjects = await parseSubjects();
    await Student.deleteMany({});
    const students = Array(1000).fill(0).map(() => studentObj(['B.A', 'B.Com', 'B.Sc'][randomIntFromInterval(0, 2)], randomIntFromInterval(1, 6), subjects));
    await Student.insertMany(students);
    db.close();
  } catch (error) {
    console.log('ERROR::', error);
    db.close();
  }
};

main();
