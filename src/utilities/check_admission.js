const { Admission } = require('../models/admission');

const checkAdmission = async (semester) => {
  const admission = await Admission.find({});

  if (admission.length !== 1) throw new Error('No Admission');

  const today = new Date().getTime();

  const closingDate = new Date(admission[0].closingDate).getTime();

  if (closingDate < today) {
    const error = new Error('Admission Closed');
    error.code = 400;
    throw error;
  }

  const semesterType = admission[0].semester;
  const evenOrOddSemester = Number(semester) % 2 === 0 ? 'even' : 'odd';
  if (semesterType !== evenOrOddSemester) {
    const error = new Error(`Admission open for ${semesterType}`);
    error.code = 400;
    throw error;
  }

  return true;
};

module.exports = { checkAdmission };
