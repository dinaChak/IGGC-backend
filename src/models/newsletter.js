const mongoose = require('mongoose');

const NewsLetterSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
  },
  subtitle: {
    type: String,
    lowercase: true,
  },
  body: String,
  author: {
    name: {
      type: String,
      required: true,
    },
    designation: String,
  },
  image: {
    path: String,
    fileName: String,
    baseDir: String,
    link: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

NewsLetterSchema
  .virtual('img')
  .get(function getImg() {
    return `${process.env.HOSTNAME}/public/${this.image.baseDir}/${this.image.fileName}`;
  });

const NewsLetter = mongoose.model('Newsletter', NewsLetterSchema);

module.exports = { NewsLetter };
