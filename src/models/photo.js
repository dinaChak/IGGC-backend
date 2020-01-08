const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  album: {
    type: String,
    enum: ['carousel', 'gallery', 'campus'],
    required: true,

  },
  description: {
    type: String,
  },
  image: {
    path: String,
    fileName: String,
    baseDir: String,
    link: String,
  },
  posted: {
    type: Date,
    default: Date.now,
  },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

PhotoSchema
  .virtual('img')
  .get(function getImg() {
    // return this.image.link;
    return `${process.env.HOSTNAME}/public/${this.image.baseDir}/${this.image.fileName}`;
  });

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = { Photo };
