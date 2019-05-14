const { Session } = require('../../models/session');
const { Admission } = require('../../models/admission');

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('admissions');
    res.send({
      sessions,
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id).populate('admissions');
    res.send({
      session,
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getCurrentSession = async (req, res) => {
  try {
    const session = await Session.findOne({ to: { $gte: new Date() } }).populate('admissions');
    if (!session) throw new Error('No Session');
    return res.send({ session });
  } catch (error) {
    return res.status(500).send();
  }
};

const getCurrentSessionAndCurrentAdmission = async (req, res) => {
  try {
    const session = await Session.findOne({ to: { $gte: new Date() } })
      .populate({
        path: 'admissions',
        match: {
          closingDate: { $gte: new Date() },
        },
      });
    res.send({ session });
  } catch (error) {
    res.status(500).send();
  }
};

const getCurrentAdmission = async (req, res) => {
  try {
    const admission = await Admission.findOne({
      closingDate: {
        $gte: new Date(),
      },
    });
    if (!admission) return res.status(204).send({ msg: 'No admission' });
    return res.send({ admission });
  } catch (error) {
    return res.status(500).send();
  }
};

module.exports = {
  getSessions,
  getSession,
  getCurrentSession,
  getCurrentAdmission,
  getCurrentSessionAndCurrentAdmission,
};
