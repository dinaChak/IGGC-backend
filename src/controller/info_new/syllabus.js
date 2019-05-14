const _ = require('lodash');

const { Syllabus } = require('../../models/syllabus');

const getSyllabuses = async (req, res) => {
  try {
    const queryBody = _.pick(req.query, ['branch']);
    const syllabuses = await Syllabus.find(queryBody).sort('title');
    res.send({ syllabuses });
  } catch (error) {
    res.status(500).send();
  }
};

const getSyllabus = async (req, res) => {
  try {
    const { id } = req.params;
    const syllabus = await Syllabus.findById(id);
    res.send({ syllabus });
  } catch (error) {
    res.status(500).send();
  }
};


module.exports = {
  getSyllabuses,
  getSyllabus,
};
