const mongoose = require('mongoose');

const PrincipalSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },
  image: {
    path: String,
    fileName: String,
    baseDir: String,
    link: String,
  },
  email: String,
  phone: String,
  address: String,
  education_qualification: String,
  date_of_join_iggc: Date,
  other_information: String,
  message: String,
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

PrincipalSchema
  .virtual('img')
  .get(function getImg() {
    return this.image.link;
  });

const Principal = mongoose.model('Principal', PrincipalSchema);

module.exports = { Principal };
