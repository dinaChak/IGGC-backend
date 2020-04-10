const _ = require('lodash');

const { NewsLetter } = require('../../models/newsletter');
const deleteFile = require('../../utilities/delete_file_promise');


const newsletterBody = (req) => {
  let body = _.pick(req.body, ['title', 'subtitle', 'body']);
  const author = _.pick(req.body, ['authorName', 'authorDesignation']);
  body = {
    ...body,
    author: {
      name: author.authorName,
      designation: author.authorDesignation || '',
    },
  };
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
  return body;
};

const createNewsletter = async (req, res) => {
  try {
    const body = newsletterBody(req);
    const newsletter = new NewsLetter(body);
    await newsletter.save();
    res.send({ newsletter });
  } catch (error) {
    res.status(500).send();
  }
};

const updateNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const body = newsletterBody(req);
    if (req.file) {
      const newsletterOld = await NewsLetter.findById(id);
      if (newsletterOld.image && newsletterOld.image.path) {
        await deleteFile(newsletterOld.image.path);
      }
    }
    const newsletter = await NewsLetter.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
    );
    res.send({ newsletter });
  } catch (error) {
    res.status(500).send();
  }
};

const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await NewsLetter.findByIdAndDelete(id);
    if (newsletter.image && newsletter.image.path) {
      await deleteFile(newsletter.image.path);
    }
    res.send({ newsletter });
  } catch (error) {
    res.status(500).send();
  }
};

module.exports = {
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
};
