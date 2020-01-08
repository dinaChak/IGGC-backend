const { Student } = require('../../models/student_new');
const { Branch } = require('../../models/branch');

const studentCount = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { status, ne_status } = req.query;
    const query = {};
    if (status) {
      query.admissionStatus = status;
    // eslint-disable-next-line camelcase
    } else if (ne_status) {
      query.admissionStatus = { $ne: ne_status };
    }
    const totalCount = await Student.countDocuments(query);
    res.send({ totalCount });
  } catch (error) {
    res.status(500).send();
  }
};

const studentCountByBranch = async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { status, ne_status } = req.query;
    const query = {};
    if (status) {
      query.admissionStatus = status;
    // eslint-disable-next-line camelcase
    } else if (ne_status) {
      query.admissionStatus = { $ne: ne_status };
    }
    const branches = await Branch.find();
    const response = await Promise.all(
      [
        ...branches.map(branch => Student.countDocuments({
          branch: branch.title,
          ...query,
        })),
      ],
    );
    res.send({
      studentCount: branches.map(({ title }, i) => ({
        branch: title,
        totalCount: response[i],
      })),
    });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  studentCount,
  studentCountByBranch,
};
