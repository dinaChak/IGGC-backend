const mongoose = require('mongoose');

const CollegeProfileSchema = new mongoose.Schema({
  image: {
    path: String,
    fileName: String,
    baseDir: String,
    link: String,
  },
  body: {
    type: String,
  },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

CollegeProfileSchema
  .virtual('img')
  .get(function getImg() {
    return this.image.link;
  });

const CollegeProfile = mongoose.model('CollegeProfile', CollegeProfileSchema);

module.exports = {
  CollegeProfile,
};
