const mongoose = require('mongoose');

const CombinationRuleSchema = new mongoose.Schema({
  branch: {
    type: String,
    lowercase: true,
    required: true,
  },
  subjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
  }],
  semester: {
    type: Number,
    enum: [1, 2, 3, 4, 5, 6],
    required: true,
  },
});

const CombinationRule = mongoose.model('CombinationRule', CombinationRuleSchema);

module.exports = {
  CombinationRule,
};
