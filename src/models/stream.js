const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const StreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  description: String,
});

StreamSchema.plugin(uniqueValidator);

const Stream = mongoose.model('Stream', StreamSchema);

module.exports = { Stream };
