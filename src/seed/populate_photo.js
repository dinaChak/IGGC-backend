const mongoose = require('mongoose');
const faker = require('faker');

const { Photo } = require('../models/photo');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/IGGC_DEV', {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


const photoObject = (album = 'gallery') => ({
  title: faker.random.words(10),
  subtitle: faker.random.words(20),
  album,
  description: faker.random.words(20),
  img: faker.random.image(),
});


const populateAlbum = async () => {
  try {
    await Photo.deleteMany({});
    const photos1 = [...Array(30).keys()].map(() => photoObject('gallery'));
    const photos2 = [...Array(30).keys()].map(() => photoObject('campus'));
    const photos3 = [...Array(4).keys()].map(() => photoObject('carousel'));
    await Photo.insertMany([...photos1, ...photos2, ...photos3]);
    db.close();
  } catch (error) {
    console.error(error);
    db.close();
  }
};

populateAlbum();
