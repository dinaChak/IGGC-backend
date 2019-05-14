const mongoose = require('mongoose');

const SyllabusSchema = new mongoose.Schema({
  branch: {
    type: String,
    lowercase: true,
  },
  title: String,
  file: {
    path: String,
    fileName: String,
    originalFileName: String,
    baseDir: String,
    link: String,
    fileType: String,
  },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

SyllabusSchema
  .virtual('link')
  .get(function getImg() {
    return this.file.link;
  });

const Syllabus = mongoose.model('Syllabus', SyllabusSchema);

module.exports = { Syllabus };
