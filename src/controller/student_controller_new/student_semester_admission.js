const _ = require('lodash');
const axios = require('axios');
const { StudentInstance } = require('../../models/studentInstance');
const { Semester } = require('../../models/semester');

const semesterAdmission = async (req, res) => {
  try {
    // eslint-disable-next-line
    const studentId = req.user._id;
    const body = _.pick(req.body, ['branch', 'number', 'subjects', 'session', 'amount']);
    const semester = new Semester({
      student: studentId,
      branch: body.branch,
      number: body.number,
      session: body.session,
      subjects: body.subjects.map(subject => ({
        subject: {
          title: subject.title,
          code: subject.code,
        },
        internal: Array.from({ length: 3 }, (v, k) => ({ number: k + 1, mark: null })),
      })),
    });
    const response = await Promise.all([
      await semester.save(),
      StudentInstance.findOneAndUpdate(
        {
          student: studentId,
        },
        {
          $set: {
            'admission.status': 'verification_document',
            current_semester: body.number,
            'admission.semester': body.number,
            'admission.applying': true,
            'admission.payment.amount': body.amount,
            // eslint-disable-next-line
            semester: semester._id
          },
        },
        {
          new: true,
        },
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

const capturePayment = async (req, res) => {
  try {
    // eslint-disable-next-line
    const studentId = req.user._id;
    // eslint-disable-next-line
    const { razorpay_payment_id } = req.params;
    const studentInstance = await StudentInstance.findOne({ student: studentId });
    const { amount } = studentInstance.admission.payment;
    await axios.post(
      // eslint-disable-next-line
      `https://${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}@api.razorpay.com/v1/payments/${razorpay_payment_id}/capture`,
      {
        amount: String(Number(amount) * 100),
      },
    );

    const studentInstanceUpdated = await StudentInstance.findOneAndUpdate(
      {
        student: studentId,
      },
      {
        $set: {
          'admission.payment.status': 'paid',
          'admission.status': 'completed',
          'admission.applying': false,
          newRegistration: false,
        },
      },
      {
        new: true,
      },
    ).populate('semester').populate('student');
    res.send({
      studentInstance: studentInstanceUpdated,
    });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send();
    }
    res.status(500).send();
  }
};

const getStudentSemesters = async (req, res) => {
  try {
    // eslint-disable-next-line
    const studentId = req.user._id;
    const semesters = await Semester.find({ student: studentId }).populate('session');
    res.send({ semesters });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  semesterAdmission,
  capturePayment,
  getStudentSemesters,
};
