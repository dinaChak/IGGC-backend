const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const CellSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  position: {
    type: Number,
    required: true,
    unique: true,
  },
  body: {
    type: String,
    required: true,
  },
});

CellSchema.plugin(uniqueValidator);

const Cell = mongoose.model('Cell', CellSchema);

module.exports = { Cell };
