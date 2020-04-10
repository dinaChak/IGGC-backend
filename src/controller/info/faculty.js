const _ = require('lodash');

const { Faculty } = require('../../models/faculty');

const getFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const { populate } = req.query;
    let faculty;
    if (populate) {
      faculty = await Faculty
        .findById(id)
        .populate(...populate.split(','));
    } else {
      faculty = await Faculty.findById(id);
    }
    res.send({ faculty });
  } catch (error) {
    res.status(500).send();
  }
};

const getFaculties = async (req, res) => {
  try {
    const { select, populate } = req.query;
    const queryBody = _.pick(req.query, ['department']);
    const query = [queryBody];
    if (select) {
      query.push(select);
    }
    let faculties;
    if (populate) {
      faculties = await Faculty
        .find(...query)
        .populate(...populate.split(','));
    } else {
      faculties = await Faculty.find(...query);
    }
    res.send({ faculties });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getFaculty,
  getFaculties,
};
