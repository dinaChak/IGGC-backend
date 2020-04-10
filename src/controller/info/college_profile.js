const { CollegeProfile } = require('../../models/college_profile');

const getCollegeProfile = async (req, res) => {
  try {
    const collegeProfile = await CollegeProfile.findOne();
    res.send({ collegeProfile });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  getCollegeProfile,
};
