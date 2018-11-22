const { Admission } = require('../models/admission');

const admissionOpen = async () => {
  try {
    const admission = await Admission.find({});

    if (admission.length !== 1) throw new Error('No Admission');

    const today = new Date().getTime();

    const closingDate = new Date(admission[0].closingDate).getTime();

    if (closingDate < today) throw new Error('No Admission');

    return true;
  } catch (error) {
    return false;
  }
};

module.exports = { admissionOpen };
