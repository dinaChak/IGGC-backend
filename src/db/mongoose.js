// @ts-check
const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
if (process.env.NODE_ENV === 'test') {
  mongoose.connect(process.env.MONGODB_TEST_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
} else {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
  });
}


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
