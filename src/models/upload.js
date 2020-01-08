const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
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

UploadSchema
  .virtual('link')
  .get(function getImg() {
    // return this.file.link;
    return `${process.env.HOSTNAME}/public/${this.file.baseDir}/${this.file.fileName}`;
  });

UploadSchema
  .virtual('type')
  .get(function getType() {
    return this.file.fileType;
  });


const Upload = mongoose.model('Upload', UploadSchema);

module.exports = { Upload };
