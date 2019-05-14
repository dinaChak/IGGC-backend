const mongoose = require('mongoose');

const IQACSchema = new mongoose.Schema({
  minutes: [{
    date: Date,
    link: String,
  }],
  aqar: [{
    from: Date,
    to: Date,
    link: String,
  }],
  composition: String,
});

const IQAC = mongoose.model('IQAC', IQACSchema);

module.exports = { IQAC };
