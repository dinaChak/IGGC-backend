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
  admissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admission',
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

SessionSchema
  .virtual('currentSession')
  .get(function isCurrentSession() {
    return new Date(this.to).getTime() > new Date().getTime();
  });

const Session = mongoose.model('Session', SessionSchema);

module.exports = { Session };
