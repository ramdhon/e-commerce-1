if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  require('dotenv').config()
}
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGOOSE_CONNECTION + ((process.env.NODE_ENV === 'test') && '_test'), { useNewUrlParser: true })
  .then(connection => {
    console.log('database connected');
  })
  .catch(err => {
    console.log('database not connected');
  })

const router = require('./router');
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', router);

app.use(errorHandler);


app.listen(PORT, () => {
  console.log(`running on port:${PORT}`);
})

module.exports = app;