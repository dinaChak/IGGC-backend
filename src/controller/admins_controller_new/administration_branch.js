const _ = require('lodash');

const { AdministrationBranch } = require('../../models/administration_branch');


const createAdministrationBranch = async (req, res) => {
  try {
    const body = _.pick(req.body, ['title']);
    const administrationBranch = new AdministrationBranch(body);
    await administrationBranch.save();
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};

const updateAdministrationBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title']);
    const administrationBranch = await AdministrationBranch.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteAdministrationBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const administrationBranch = await AdministrationBranch.findByIdAndDelete(id);
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};

const createAdministrationBranchStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['name', 'designation']);
    const administrationBranch = await AdministrationBranch.findByIdAndUpdate(
      id,
      {
        $push: {
          staffs: body,
        },
      },
    );
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};


const updateAdministrationBranchStaff = async (req, res) => {
  try {
    const { id, staffId } = req.params;
    const body = _.pick(req.body, ['name', 'designation']);
    const administrationBranch = await AdministrationBranch.findOneAndUpdate(
      {
        _id: id,
        'staffs._id': staffId,
      },
      {
        $set: {
          'staffs.$': body,
        },
      },
      { new: true },
    );
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteAdministrationBranchStaff = async (req, res) => {
  try {
    const { id, staffId } = req.params;
    const administrationBranch = await AdministrationBranch.findByIdAndUpdate(
      id,
      {
        $pull: {
          staffs: { _id: staffId },
        },
      },
      { new: true },
    );
    res.send({ administrationBranch });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createAdministrationBranch,
  updateAdministrationBranch,
  deleteAdministrationBranch,
  createAdministrationBranchStaff,
  updateAdministrationBranchStaff,
  deleteAdministrationBranchStaff,
};
