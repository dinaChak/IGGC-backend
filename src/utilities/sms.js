const axios = require('axios');
const urlencode = require('urlencode');

const sendSMS = async (numbers = [], msg = '') => {
  try {
    if (numbers.length === 0) {
      const error = new Error('Please provide numbers');
      error.type = 'SMS';
      throw error;
    }
    if (!msg) {
      const error = new Error('Please provide msg');
      error.type = 'SMS';
      throw error;
    }
    const data = `apikey=${process.env.TEXTLOCAL_API_KEY}&sender=${process.env.TEXTLOCAL_SENDER_ID}&numbers=${numbers.join(',')}&message=${urlencode(msg)}`;
    const res = await axios(`https://api.textlocal.in/send/?${data}`);
    return res.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = sendSMS;
