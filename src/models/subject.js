const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  title: String,
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
  }],
});


const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = { Subject };
