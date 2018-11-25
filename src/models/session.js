const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
});

const Session = mongoose.model('Session', SessionSchema);

module.exports = { Session };
