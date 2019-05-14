const mongoose = require('mongoose');

const SubjectRuleSchema = new mongoose.Schema({
  branch: {
    type: String,
    lowercase: true,
  },
  rule: String,
});

const SubjectRule = mongoose.model('SubjectRule', SubjectRuleSchema);

module.exports = { SubjectRule };
