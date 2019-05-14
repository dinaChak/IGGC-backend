const mongoose = require('mongoose');

const SubjectsSchema = new mongoose.Schema({
  subject: {
    title: String,
    code: String,
  },
  internal: [
    {
      number: Number,
      mark: Number,
    },
  ],
});

const SemesterSchema = new mongoose.Schema({
  number: {
    type: Number,
  },
  subjects: [SubjectsSchema],
  external: {
    type: String,
    enum: ['pass', 'pwbp', 'fail'],
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  branch: {
    type: String,
    lowercase: true,
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  },
  result: {
    type: String,
    enum: ['pass', 'pwbp', 'fail', 'ab'],
  },
});

const Semester = mongoose.model('Semester', SemesterSchema);

module.exports = {
  Semester,
};
