const _ = require('lodash');

const { SubjectRule } = require('../../models/subject_rule');


const createSubjectRule = async (req, res) => {
  try {
    const body = _.pick(req.body, ['branch', 'rule']);
    const subjectRule = new SubjectRule(body);
    await subjectRule.save();
    res.send({ subjectRule });
  } catch (error) {
    res.status(500).send();
  }
};

const updateSubjectRule = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['branch', 'rule']);
    const subjectRule = await SubjectRule.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      {
        new: true,
      },
    );
    res.send({
      subjectRule,
    });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteSubjectRule = async (req, res) => {
  try {
    const { id } = req.params;
    const subjectRule = await SubjectRule.findByIdAndDelete(id);
    res.send({ subjectRule });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createSubjectRule,
  updateSubjectRule,
  deleteSubjectRule,
};
