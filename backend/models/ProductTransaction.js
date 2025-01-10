// /server/models/ProductTransaction.js
const mongoose = require('mongoose');

const ProductTransactionSchema = new mongoose.Schema({
  productTitle: String,
  productDescription: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean
});

module.exports = mongoose.model('ProductTransaction', ProductTransactionSchema);
