const express = require('express');
const mongoose = require('mongoose');
const app = express();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/citibikes?retryWrites=true&w=majority';
// const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://user_camille_clara_jeanne:wCXS8PPZcSMdQGTE@cluster0.lenqb.mongodb.net/citibikes_nyc?retryWrites=true&w=majority';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected : %s', MONGO_URI))
  .catch(err => console.log(err));

const processor = require('./src/processor');
// const processor = require('./src/processor-status');

processor.main();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));