const { NewsLetter } = require('../../models/newsletter');

const getNewsletters = async (req, res) => {
  try {
    const {
      select,
      limit = 10,
      page = 0,
    } = req.query;
    const query = [{}];
    if (select) query.push(select);
    const response = await Promise.all([
      NewsLetter.find(...query)
        .sort('-date')
        .limit(Number(limit))
        .skip(Number(limit) * Number(page)),
      NewsLetter.countDocuments({}),
    ]);
    res.send({
      newsletters: response[0],
      totalCount: response[1],
    });
  } catch (error) {
    res.status(500).send();
  }
};

const getNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const newsletter = await NewsLetter.findById(id);
    if (!newsletter) return res.status(404).send({ error: 'Newsletter not found' });
    return res.send({ newsletter });
  } catch (error) {
    return res.status(500).send();
  }
};

module.exports = {
  getNewsletters,
  getNewsletter,
};
