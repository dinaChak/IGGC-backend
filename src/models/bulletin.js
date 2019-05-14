const mongoose = require('mongoose');

const BulletinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
  },
  body: {
    type: String,
  },
  type: {
    type: String,
    enum: ['examinations', 'news', 'events'],
  },
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
  .get(function getLink() {
    return this.attachment.link;
  });

const Bulletin = mongoose.model('Bulletin', BulletinSchema);

module.exports = { Bulletin };
