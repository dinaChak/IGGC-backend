const _ = require('lodash');
const { Subject } = require('../../models/subject');

const getSubjects = async (req, res) => {
  try {
    const queryBody = _.pick(req.query, ['branch']);
    const {
      limit = 10,
      page = 0,
      select,
    } = req.query;
    const query = [queryBody];
    if (select) {
      query.push(select);
    }
    const response = await Promise.all([
      Subject.find(...query)
        .sort('title')
        .limit(Number(limit))
        .skip(Number(limit) * Number(page)),
      Subject.countDocuments(query),
    ]);
    res.send({
      subjects: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getAllSubject = async (req, res) => {
  try {
    const queryBody = _.pick(req.query, ['branch']);
    const { select } = req.query;
    const query = [queryBody];
    if (select) {
      query.push(select);
    }
    const subjects = await Subject.find(...query).sort('title');
    res.send({ subjects });
  } catch (error) {
    res.status(500).send();
  }
};

const getSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findById(id);
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getSubjects,
  getAllSubject,
  getSubject,
};
