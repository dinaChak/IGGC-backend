const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const { Subject } = require('../models/subject');

const readFile = filePath => new Promise((resolve, reject) => {
  fs.readFile(filePath, (err, data) => {
    if (err) reject(err);
    resolve(data);
  });
});


mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/IGGC_DEV', {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

const parseSubject = subjectsObj => Object.keys(subjectsObj).map(subject => ({
  title: subject,
  branch: subjectsObj[subject].branch.toLowerCase(),
  _id: mongoose.Types.ObjectId(),
  papers: subjectsObj[subject].papers.map(paper => ({
    title: paper.title,
    code: paper.code,
    semester: Number(paper.semester),
    _id: mongoose.Types.ObjectId(),
  })),
}));

const main = async () => {
  await Subject.deleteMany({});
  const data = await readFile(path.join(__dirname, 'subjects_formatted.json'));
  const obj = JSON.parse(data);
  const subjects = parseSubject(obj);
  await Subject.insertMany(subjects);
  db.close();
};

main();
