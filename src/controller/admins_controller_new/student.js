const _ = require('lodash');
const { StudentInstance } = require('../../models/studentInstance');
const { Student } = require('../../models/student');
const { Semester } = require('../../models/semester');

const getStudents = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 0,
      sort = '',
      newRegistration,
      searchTerm = '',
      verificationStatus = '',
      semesterAdmission,
    } = req.query;
    const queryBody = _.pick(req.query, ['current_semester'], ['branch']);
    const query = {
      newRegistration: newRegistration === 'true',
      ...queryBody,
    };

    if (semesterAdmission === 'true') {
      query.newRegistration = false;
      query['admission.status'] = { $nin: ['eligible', 'ineligible', 'admission_initiated', 'completed'] };
    }

    if (searchTerm.trim() !== '') {
      query.$text = { $search: searchTerm };
    }

    if (verificationStatus.trim() !== '') {
      query['admission.status'] = verificationStatus;
    }


    const response = await Promise.all([
      StudentInstance.find(query)
        .limit(Number(limit))
        .skip(Number(limit) * Number(page))
        .populate('semester')
        .populate('student')
        .sort(sort),
      StudentInstance.countDocuments(query),
    ]);
    res.send({
      students: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getSemesters = async (req, res) => {
  try {
    const {
      limit = 10,
      page = 0,
      sort = '',
    } = req.query;
    const queryBody = _.pick(req.query, ['number'], ['branch']);
    const response = await Promise.all([
      Semester.find(queryBody)
        .limit(Number(limit))
        .skip(Number(limit) * Number(page))
        .sort(sort)
        .populate('student'),
      Semester.countDocuments(queryBody),
    ]);
    res.send({
      semesters: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentInstance = await StudentInstance.findById(id).populate('semester').populate('student');
    const { semester, student } = studentInstance;
    res.send({
      semester,
      student,
      instance: studentInstance,
    });
  } catch (error) {
    res.status(500).send();
  }
};

const verifyApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejection_reasons = '' } = req.body;
    const body = {
      'admission.status': status,
      'admission.rejection_reasons': rejection_reasons,
    };
    const studentInstance = await StudentInstance.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ studentInstance });
  } catch (error) {
    res.status(500).send();
  }
};

const getSemester = async (req, res) => {
  try {
    const { id } = req.params;
    const semester = await Semester.findById(id);
    res.send({ semester });
  } catch (error) {
    res.status(500).send();
  }
};

const getStudentSemesters = async (req, res) => {
  try {
    const { id } = req.params;
    const semesters = await Semester.find({ student: id });
    res.send({ semesters });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentSemesterInternal = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjects, number } = req.body;
    const semester = await Semester.findById(id);
    const subjectCodes = Object.keys(subjects);
    const updatedSubjects = semester.subjects.map((el) => {
      if (subjectCodes.includes(el.subject.code)) {
        return {
          subject: el.subject,
          internal: el.internal.map((inter) => {
            if (inter.number === number) {
              return {
                // eslint-disable-next-line
                _id: inter._id,
                number: inter.number,
                mark: subjects[el.subject.code],
              };
            }
            return inter;
          }),
        };
      }
      return el;
    });
    const updatedSemester = await Semester.findByIdAndUpdate(
      id,
      {
        $set: {
          subjects: updatedSubjects,
        },
      },
      { new: true },
    );
    res.send({
      semester: updatedSemester,
    });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentSemesterExternal = async (req, res) => {
  try {
    const { result, status } = req.body;
    const { id } = req.params;
    const response = await Promise.all([
      Semester.findOneAndUpdate(
        { student: id },
        {
          $set: { result },
        },
        { new: true },
      ),
      StudentInstance.findOneAndUpdate(
        { student: id },
        {
          $set: {
            admission: {
              status,
              rejection_reasons: '',
              documentImage: '',
              payment: {},
            },
          },
        },
        { new: true },
      ),
    ]);
    res.send({
      semester: response[0],
      studentInstance: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentRollNo = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['rollNumber']);
    const response = await Promise.all([
      Student.findByIdAndUpdate(id, { $set: body }, { new: true }),
      StudentInstance.findOneAndUpdate({ student: id }, { $set: body }, { new: true }),
    ]);
    res.send({
      student: response[0],
      studentInstance: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

// TODO: student, semester
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const studentInstance = await StudentInstance.findByIdAndDelete(id);
    res.send({ studentInstance });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getStudents,
  getSemesters,
  getSemester,
  getStudent,
  verifyApplicant,
  getStudentSemesters,
  updateStudentSemesterInternal,
  updateStudentSemesterExternal,
  updateStudentRollNo,
  deleteStudent,
};
