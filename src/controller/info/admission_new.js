const { AdmissionNew } = require('../../models/admission_new');

const getAdmission = async (req, res) => {
  try {
    const admission = await AdmissionNew.findOne({});
    res.send({ admission });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = { getAdmission };
