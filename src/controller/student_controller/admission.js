const _ = require('lodash');

const { Student } = require('../../models/student_new');

const studentAdmission = async (req, res) => {
  try {
    const { _id: id } = req.student;
    const body = _.pick(req.body, [
      'last_examination',
      'uni_reg_no',
      'uni_roll_no',
      'branch',
      'semester',
      'subjectCombination',
      'major_subject',
    ]);
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = { studentAdmission };
