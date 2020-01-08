const _ = require('lodash');

const { Student } = require('../../models/student_new');
const { SMS } = require('../../models/sms_counter');
const sendSMS = require('../../utilities/sms');


const sendMassSMS = async (req, res) => {
  try {
    const { message, status } = req.body;
    const queryBody = _.pick(req.query, ['branch', 'semester']);
    queryBody.admissionStatus = status;
    /**
     * temp
     */
    if (status !== 'completed') {
      queryBody.admissionStatus = 'completed';
    }
    const students = await Student.find(queryBody);
    if (students.length > 10000) {
      res.status(422).send({
        error: {
          msg: 'Exceeds 10,000  mobile number limits.',
        },
      });
    } else if (students.length === 0) {
      res.status(422).send({
        error: {
          msg: 'No student found.',
        },
      });
    } else {
      let smsList = [];
      for (let i = 0; i < students.length; i += 100) {
        smsList = [...smsList, sendSMS(students.slice(i, i + 100)
          .map(student => student.phone_number), message)];
      }

      const smsResults = await Promise.all(smsList);
      const smsCounter = await SMS.findOneAndUpdate(
        {},
        { $set: { balance: smsResults[smsResults.length - 1].balance } },
        { new: true },
      );
      res.send({ smsCounter });
    }
  } catch (error) {
    console.error('ERROR', error);
    res.status(500).send();
  }
};

const sendSingleSMS = async (req, res) => {
  try {
    const { number, message } = req.body;
    const smsData = await sendSMS([number], message);
    const smsCounter = await SMS.findOneAndUpdate(
      {},
      { $set: { balance: smsData.balance } },
      { new: true },
    );
    res.send({ smsCounter });
  } catch (error) {
    res.status(500).send();
  }
};

const sendManySMS = async (req, res) => {
  try {
    const { numbers, message } = req.body;
    const smsData = await sendSMS(numbers, message);
    const smsCounter = await SMS.findOneAndUpdate(
      {},
      { $set: { balance: smsData.balance } },
      { new: true },
    );
    res.send({ smsCounter });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  sendMassSMS,
  sendSingleSMS,
  sendManySMS,
};
