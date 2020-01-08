const _ = require('lodash');

const { AdmissionNew } = require('../../models/admission_new');


const updateAdmissionInstruction = async (req, res) => {
  try {
    const { id } = req.params;
    const { instruction = '' } = req.body;
    const admission = await AdmissionNew.findByIdAndUpdate(
      id,
      {
        $set: {
          instruction,
        },
      },
      { new: true },
    );
    res.send({ admission });
  } catch (error) {
    res.status(500).send();
  }
};

const updateAdmissionFeeStructure = async (req, res) => {
  try {
    const { id } = req.params;
    const { feeStructure = '' } = req.body;
    const admission = await AdmissionNew.findByIdAndUpdate(
      id,
      {
        $set: {
          feeStructure,
        },
      },
      { new: true },
    );
    res.send({ admission });
  } catch (error) {
    res.status(500).send();
  }
};

const updateAdmissionHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['hostel']);
    const admission = await AdmissionNew.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      { new: true },
    );
    res.send({ admission });
  } catch (error) {
    res.status(500).send();
  }
};

const updateAdmissionDates = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['start_date', 'end_date', 'semesters']);
    body.session = _.pick(req.body, ['from', 'to']);
    const admission = await AdmissionNew.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ admission });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  updateAdmissionInstruction,
  updateAdmissionFeeStructure,
  updateAdmissionHostel,
  updateAdmissionDates,
};
