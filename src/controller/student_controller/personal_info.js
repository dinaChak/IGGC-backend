const _ = require('lodash');

const { Student } = require('../../models/student_new');

const updateStudentPersonalInfo = async (req, res) => {
  try {
    const { _id: id } = req.student;
    const body = _.pick(
      req.body,
      [
        'fatherName',
        'motherName',
        'religion',
        'category',
        'nationality',
        'employed',
        'presentAddress',
        'permanentAddress',
        'bank_detail',
        'aadhaar_no',
      ],
    );
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

module.exports = { updateStudentPersonalInfo };
