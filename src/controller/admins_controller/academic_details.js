const { Student } = require('../../models/student_new');


const updateStudentAcademicDetails = async (req, res) => {
  let updatedStudent;
  try {
    const { id } = req.params;
    const { failed = false, session, subjectCombination } = req.body;
    const student = Student.findById(id);
    const prevSemesterDetails = {
      subjects: student.subjectCombination,
      number: student.semester,
      session,
    };
    if (failed) {
      updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: { failed } },
        { new: true },
      );
    }
    const semesters = [...student.semesters.map(semester => ({
      subjects: semester.subjects,
      number: semester.number,
      session: semester.session,
    })), prevSemesterDetails];

    updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          semesters,
          failed,
          subjectCombination,
          semester: student.semester + 1,
        },
      },
      { new: true },
    );
    res.send({ student: updatedStudent });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { updateStudentAcademicDetails };
