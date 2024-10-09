const mongoose = require('mongoose');
require('dotenv').config();
//db connection
mongoose.connect(process.env.MONGO_URI, {

}).then(() => console.log('database - Mongodb Connected'))
  .catch(err => console.log(err));

module.exports = mongoose;
