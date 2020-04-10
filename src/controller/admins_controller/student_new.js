const _ = require('lodash');

const { Student } = require('../../models/student_new');
const { SMS } = require('../../models/sms_counter');
const sendSMS = require('../../utilities/sms');
const deleteFile = require('../../utilities/delete_file_promise');

const getStudents = async (req, res) => {
  try {
    const {
      search,
      sort = 'semester',
      limit = 10,
      page = 0,
      select,
    } = req.query;
    const query = _.pick(req.query, ['branch', 'admissionStatus', 'semester']);
    const queryBody = [];
    if (search) query.$text = { $search: search };
    queryBody.push(query);
    if (select) queryBody.push(select);

    const response = await Promise.all([
      Student.find(...queryBody)
        .sort(sort)
        .limit(Number(limit))
        .skip(Number(limit) * Number(page)),
      Student.countDocuments(query),
    ]);
    res.send({ students: response[0], totalCount: response[1] });
  } catch (error) {
    res.status(500).send();
  }
};

const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const verifyApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    let student = await Student.findById(id);
    if (student && student.admissionStatus === 'verification') {
      student = await Student.findByIdAndUpdate(
        id,
        { $set: { admissionStatus: 'verified' } },
        { new: true },
      );
      const smsData = await sendSMS([student.phone_number], message);
      await SMS.findOneAndUpdate({}, { $set: { balance: smsData.balance } });
    }
    res.send({ student });
  } catch (error) {
    if (error.type && error.type === 'SMS') {
      res.status(422).send({ error: { msg: error.message } });
    } else {
      res.status(500).send();
    }
  }
};

const updateAdmissionStatus = async (id, status, message) => {
  try {
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: { admissionStatus: status } },
      { new: true },
    );
    const smsData = await sendSMS([student.phone_number], message);
    await SMS.findOneAndUpdate({}, { $set: { balance: smsData.balance } });
    return student;
  } catch (error) {
    return Promise.reject(error);
  }
};

const verifySelectedApplicants = async (req, res) => {
  try {
    const { message, ids } = req.body;
    // if (!Array.isArray(ids) || ids.length === 0) {
    //   return res.status().send
    // }
    const response = await Promise.all(ids.map(id => updateAdmissionStatus(id, 'verified', message)));
    res.send({ students: response });
  } catch (error) {
    res.status(500).send();
  }
};

const admissionCompletedApplicant = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    let student = await Student.findById(id);
    if (student && student.admissionStatus === 'verified') {
      student = await Student.findByIdAndUpdate(
        id,
        { $set: { admissionStatus: 'completed' } },
        { new: true },
      );
      const smsData = await sendSMS([student.phone_number], message);
      await SMS.findOneAndUpdate({}, { $set: { balance: smsData.balance } });
    }
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const admissionCompletedSelectedApplicants = async (req, res) => {
  try {
    const { message, ids } = req.body;
    const response = await Promise.all(ids.map(id => updateAdmissionStatus(id, 'completed', message)));
    res.send({ students: response });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudentSubjectCombination = async (req, res) => {
  try {
    const { id } = req.params;
    const { subjectCombination } = req.body;
    const student = await Student.findByIdAndUpdate(
      id,
      {
        $set: { subjectCombination },
      },
      { new: true },
    );
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(
      req.body,
      [
        'name',
        'date_of_birth',
        'gender',
        'fatherName',
        'motherName',
        'religion',
        'category',
        'presentAddress',
        'permanentAddress',
        'bank_detail',
        'aadhaar_no',
        'employed',
        'have_disability',
        'last_examination',
        'subjectCombination',
        'branch',
        'uni_reg_no',
        'uni_roll_no',
        'class_roll_no',
        'major_subject',
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


const updateStudentClassRollNo = async (req, res) => {
  try {
    const { rollNoMobile } = req.body;
    const mobileNos = Object.keys(rollNoMobile);
    const students = await Promise.all(mobileNos.map(mobileNo => Student
      .findOneAndUpdate(
        { phone_number: mobileNo },
        { $set: { class_roll_no: rollNoMobile[mobileNo] } },
        { new: true },
      )));
    res.send({ students });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);
    await Promise.all([
      deleteFile(student.profile_image.path),
      deleteFile(student.signature_image.path),
      ...student
        .verification_documents
        .map(doc => deleteFile(doc.file.path)),
    ]);
    res.send({ student });
  } catch (error) {
    res.status(500).send();
  }
};

const getAllStudents = async (req, res) => {
  try {
    const query = { admissionStatus: 'completed' };
    const response = await Promise.all([
      Student.find(query),
      Student.countDocuments(query),
    ]);
    res.send({
      students: response[0],
      totalCount: response[1],
      date: new Date(),
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getStudents,
  getAllStudents,
  getStudent,
  verifyApplicant,
  admissionCompletedApplicant,
  verifySelectedApplicants,
  admissionCompletedSelectedApplicants,
  updateStudentSubjectCombination,
  updateStudent,
  updateStudentClassRollNo,
  deleteStudent,
};
