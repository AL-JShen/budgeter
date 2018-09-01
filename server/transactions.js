const mongoose = require('mongoose');

const tranSchema = new mongoose.Schema({
  category: 'string',
  price: 'string',
  date: 'string'
});

module.exports = mongoose.model('transaction', tranSchema);
