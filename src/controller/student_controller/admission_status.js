const { Student } = require('../../models/student_new');
// const { SMS } = require('../../models/sms_counter');
// const sendSMS = require('../../utilities/sms');


const checkStatus = async (req, res) => {
  try {
    const { student } = req;
    if (student.admissionStatus !== 'applying') {
      return res.send({ student });
    }
    if (student.semester === 1) {
      if (student.verification_documents.length < 2) {
        return res.send({
          error: {
            msg: 'Please upload all the required documents',
          },
        });
      }
    } else if (student.verification_documents.length === 0) {
      return res.send({
        error: {
          msg: 'Please upload all the required documents',
        },
      });
    }
    const studentUpdate = await Student.findByIdAndUpdate(
      // eslint-disable-next-line
      student._id,
      {
        $set: {
          admissionStatus: 'verification',
        },
      },
      { $new: true },
    );
    // const message =
    // 'Your application has been accepted. The date of verification will notify later.';
    // const smsData = await sendSMS([studentUpdate.phone_number], message);
    // await SMS.findOneAndUpdate(
    //   {},
    //   { $set: { balance: smsData.balance } },
    //   { new: true },
    // );
    return res.send({ student: studentUpdate });
  } catch (error) {
    return res.status(500).send();
  }
};


module.exports = { checkStatus };
