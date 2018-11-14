const {
  Schema,
  model
} = require('mongoose');

const SemesterSchema = new Schema({
  number: Number,
  internals: [{
    number: Number,
    marks: [{
      subject: {
        type: String,
        minlength: 1
      },
      mark: Number,
      result: String,
    }]
  }],
  external: {
    marks: [{
      subject: {
        type: String,
        minlength: 1
      },
      mark: Number,
      result: String,
    }],
    result: {
      type: String
    },
    remark: String
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: 'Student'
  }
});

const Semester = model('Semester', SemesterSchema);

module.exports = { Semester };