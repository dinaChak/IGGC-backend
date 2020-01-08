const { SMS } = require('../../models/sms_counter');

const getSMSCount = async (req, res) => {
  try {
    const sms = await SMS.findOne();
    res.send({ sms });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getSMSCount,
};
