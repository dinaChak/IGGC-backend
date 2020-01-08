const mongoose = require('mongoose');

const InfrastructureFacilitySchema = new mongoose.Schema({
  image: {
    path: String,
    fileName: String,
    baseDir: String,
    link: String,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  position: {
    type: Number,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    required: true,
  },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

InfrastructureFacilitySchema
  .virtual('img')
  .get(function getImg() {
    // return this.image.link;
    return this.image.baseDir
      ? `${process.env.HOSTNAME}/public/${this.image.baseDir}/${this.image.fileName}`
      : '';
  });

const InfrastructureFacility = mongoose.model('InfrastructureFacility', InfrastructureFacilitySchema);

module.exports = { InfrastructureFacility };
