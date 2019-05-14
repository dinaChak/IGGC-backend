const _ = require('lodash');

const { Subject } = require('../../models/subject');

const createSubject = async (req, res) => {
  try {
    const body = _.pick(req.body, ['title', 'branch']);
    const subject = new Subject(body);
    await subject.save();
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};


const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title', 'branch']);
    const subject = await Subject.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByIdAndDelete(id);
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};

const createPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const body = _.pick(req.body, ['title', 'code', 'semester']);
    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        $push: {
          papers: body,
        },
      },
      { new: true },
    );
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};

const updatePaper = async (req, res) => {
  try {
    const { id, paperId } = req.params;
    const body = _.pick(req.body, ['title', 'code', 'semester']);
    const subject = await Subject.findOneAndUpdate(
      {
        _id: id,
        'papers._id': paperId,
      },
      {
        $set: {
          'papers.$': body,
        },
      },
      { new: true },
    );
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};

const deletePaper = async (req, res) => {
  try {
    const { id, paperId } = req.params;
    const subject = await Subject.findByIdAndUpdate(
      id,
      {
        $pull: {
          papers: { _id: paperId },
        },
      },
      { new: true },
    );
    res.send({ subject });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createSubject,
  updateSubject,
  deleteSubject,
  createPaper,
  updatePaper,
  deletePaper,
};
