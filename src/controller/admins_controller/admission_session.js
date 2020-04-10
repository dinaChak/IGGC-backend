const _ = require('lodash');

const { Admission } = require('../../models/admission');
const { Session } = require('../../models/session');

const createSession = async (req, res) => {
  try {
    const body = _.pick(req.body, ['from', 'to']);
    const session = new Session(body);
    await session.save();
    return res.send({ session });
  } catch (error) {
    return res.status(500).send();
  }
};

const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['from', 'to']);
    const session = await Session.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!session) return res.status(422).send({ errors: [{ msg: 'invalid session' }] });
    return res.send({ session });
  } catch (error) {
    return res.status(500).send();
  }
};

const createAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['semesterType', 'openingDate', 'closingDate', 'branches']);
    let session = await Session.findById(id).populate('admissions');
    if (session.admissions.length === 2) {
      return res.status(423).send({ errors: [{ msg: 'Cannot create more admission for this session' }] });
    }
    if (session.admissions.some(admission => admission.semesterType === body.semesterType)) {
      return res.status(423).send({ errors: [{ field: 'semesterType', msg: `semester type ${body.semesterType} already present.` }] });
    }
    if ((!session.admissions || session.admissions.length === 0) && body.semesterType !== 'odd') {
      return res.status(423).send({ errors: [{ field: 'semesterType', msg: 'semester type must be odd.' }] });
    }
    const admission = new Admission(body);
    await admission.save();
    session = await Session.findByIdAndUpdate(id, {
      // eslint-disable-next-line
      $push: { admissions: admission._id },
    }, { new: true });
    return res.send({
      session,
      admission,
    });
  } catch (error) {
    return res.status(500).send();
  }
};

const updateAdmission = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['openingDate', 'closingDate', 'branches']);
    const admission = await Admission.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!admission) return res.status(422).send({ errors: [{ msg: 'invalid admission' }] });
    return res.send({ admission });
  } catch (error) {
    return res.status(500).send();
  }
};


module.exports = {
  createSession,
  updateSession,
  createAdmission,
  updateAdmission,
};
