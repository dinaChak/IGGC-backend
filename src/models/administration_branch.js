const mongoose = require('mongoose');

const AdministrationBranchSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  staffs: [{
    name: {
      type: String,
    },
    designation: String,
  }],
});


const AdministrationBranch = mongoose.model('Administration', AdministrationBranchSchema);

module.exports = { AdministrationBranch };
