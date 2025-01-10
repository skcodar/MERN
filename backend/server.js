// /server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const transactionsRoutes = require('./routes/transactions');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api', transactionsRoutes);

mongoose.connect('mongodb://localhost:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.log('MongoDB connection error: ', err);
});

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
