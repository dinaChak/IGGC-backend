const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

require('dotenv').config()
require('./db/mongoose');
const studentRoutes = require('./routes/student_route');
const adminRoutes = require('./routes/admin_route');

// setup
const app = express();
const PORT = process.env.PORT || 5000;

// configure
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}


// routes
app.get("/", (req, res) => {
  res.json({
    message: 'Hello World!'
  })
});

app.use('/student', studentRoutes);
app.use('/admin', adminRoutes);

app.listen(PORT, () => console.log(`server is listening on ${PORT}`));

module.exports = app;