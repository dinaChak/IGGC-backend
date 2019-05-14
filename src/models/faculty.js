const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
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
  position: String,
  seniority: {
    type: Number,
    required: true,
  },
  education_qualification: String,
  designation: String,
  date_of_join_as_prof_lec: Date,
  date_of_join_iggc: Date,
  net_slet: {
    type: String,
    lowercase: true,
  },
  additional_responsibilities: String,
  other_information: String,
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

FacultySchema
  .virtual('img')
  .get(function getImg() {
    return this.image.link;
  });

const Faculty = mongoose.model('Faculty', FacultySchema);

module.exports = { Faculty };
