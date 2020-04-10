const _ = require('lodash');

const { InfrastructureFacility } = require('../../models/infrastructure_facility');
const deleteFile = require('../../utilities/delete_file_promise');

const createInfrastructureFacility = async (req, res) => {
  try {
    let body = _.pick(req.body, ['title', 'subtitle', 'body', 'position']);
    if (req.file) {
      body = {
        ...body,
        image: {
          path: req.file.path,
          fileName: req.file.fileName,
          baseDir: req.file.baseDir,
          link: req.file.link,
        },
      };
    }
    const infrastructureFacility = new InfrastructureFacility(body);
    await infrastructureFacility.save();
    res.send({ infrastructureFacility });
  } catch (error) {
    res.status(500).send();
  }
};

const updateInfrastructureFacility = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(req.body, ['title', 'subtitle', 'body', 'position']);
    if (req.file) {
      const infrastructureFacilityObj = await InfrastructureFacility.findById(id);
      if (infrastructureFacilityObj.image && infrastructureFacilityObj.image.path) {
        await deleteFile(infrastructureFacilityObj.image.path);
      }
      body = {
        ...body,
        image: {
          path: req.file.path,
          fileName: req.file.fileName,
          baseDir: req.file.baseDir,
          link: req.file.link,
        },
      };
    }
    const infrastructureFacility = await InfrastructureFacility.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ infrastructureFacility });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteInfrastructureFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const infrastructureFacility = await InfrastructureFacility.findByIdAndDelete(id);
    if (infrastructureFacility.image && infrastructureFacility.image.path) {
      await deleteFile(infrastructureFacility.image.path);
    }
    res.send({ infrastructureFacility });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createInfrastructureFacility,
  updateInfrastructureFacility,
  deleteInfrastructureFacility,
};
