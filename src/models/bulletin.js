const mongoose = require('mongoose');

const BulletinSchema = new mongoose.Schema({
  title: String,
  description: String,
  body: String,
  type: String,
  date: {
    type: Date,
    default: Date.now,
  },
  attachment: {
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

BulletinSchema
  .virtual('link')
  // .get(() => this.attachment.link);
  .get(function getImg() {
    return `${process.env.HOSTNAME}/public/${this.attachment.baseDir}/${this.attachment.fileName}`;
  });

const Bulletin = mongoose.model('Bulletin', BulletinSchema);

module.exports = { Bulletin };
