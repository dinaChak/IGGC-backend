const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  title: String,
  is_major: Boolean,
  branch: {
    type: String,
    lowercase: true,
  },
  papers: [{
    title: {
      type: String,
    },
    code: String,
    semester: Number,
    selected: {
      type: Boolean,
      default: false,
    },
  }],
});


const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = { Subject };
