const _ = require('lodash');

const { SubjectRule } = require('../../models/subject_rule');

const getSubjectRules = async (req, res) => {
  try {
    const queryBody = _.pick(req.query, ['branch']);
    const subjectRules = await SubjectRule.find(queryBody);
    res.send({ subjectRules });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  getSubjectRules,
};
