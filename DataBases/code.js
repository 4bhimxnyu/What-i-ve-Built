require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(' MongoDB Atlas connected');

    app.listen(3000, () => {
      console.log(' Server running on port 3000');
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed');
    console.error(err);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});