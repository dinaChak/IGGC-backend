const _ = require('lodash');

const { Principal } = require('../../models/principal');
const deleteFile = require('../../utilities/delete_file_promise');

const createPrincipal = async (req, res) => {
  try {
    let body = _.pick(
      req.body,
      [
        'name',
        'email',
        'phone',
        'address',
        'education_qualification',
        'date_of_join_iggc',
        'other_information',
        'message',
      ],
    );
    body = {
      ...body,
      image: {
        path: req.file.path,
        fileName: req.file.fileName,
        baseDir: req.file.baseDir,
        link: req.file.link,
      },
    };
    const principal = new Principal(body);
    await principal.save();
    res.send({ principal });
  } catch (error) {
    res.status(500).send();
  }
};

const updatePrincipal = async (req, res) => {
  try {
    const { id } = req.params;
    let body = _.pick(
      req.body,
      [
        'name',
        'email',
        'phone',
        'address',
        'education_qualification',
        'date_of_join_iggc',
        'other_information',
        'message',
      ],
    );
    if (req.file) {
      const principalObj = await Principal.findById(id);
      await deleteFile(principalObj.image.path);
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
    const principal = await Principal.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      {
        new: true,
      },
    );
    res.send({ principal });
  } catch (error) {
    res.status(500).send();
  }
};

const deletePrincipal = async (req, res) => {
  try {
    const { id } = req.params;
    const principal = await Principal.findByIdAndDelete(id);
    if (principal) { await deleteFile(principal.image.path); }
    res.send({ principal });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createPrincipal,
  updatePrincipal,
  deletePrincipal,
};
