const mongoose = require('mongoose');

const SMSSchema = new mongoose.Schema({
  balance: {
    type: Number,
  },
});

const SMS = mongoose.model('SMS', SMSSchema);

module.exports = { SMS };
