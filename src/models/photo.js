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
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

PhotoSchema
  .virtual('img')
  .get(function getImg() {
    return this.image.link;
  });

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = { Photo };
