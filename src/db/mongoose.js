const mongoose = require('mongoose');


mongoose.set('useFindAndModify', false);
let uri = '';
if (process.env.NODE_ENV === 'test') {
  uri = process.env.MONGODB_TEST_URI;
} else if (process.env.NODE_ENV === 'development') {
  uri = process.env.MONGODB_URI_DEV;
} else {
  uri = process.env.MONGODB_URI;
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
});


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
