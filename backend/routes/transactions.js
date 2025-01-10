// /server/routes/transactions.js
const express = require('express');
const axios = require('axios');
const ProductTransaction = require('../models/ProductTransaction');

const router = express.Router();

// 1. Initialize Database with Seed Data
router.get('/initialize', async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;
    
    await ProductTransaction.insertMany(transactions);
    res.status(200).json({ message: 'Database initialized successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initialize database' });
  }
});

// 2. List Transactions with Search and Pagination
router.get('/transactions', async (req, res) => {
  const { search = '', page = 1, perPage = 10, month } = req.query;

  try {
    const query = {
      $or: [
        { productTitle: { $regex: search, $options: 'i' } },
        { productDescription: { $regex: search, $options: 'i' } },
        { price: { $regex: search, $options: 'i' } },
      ],
      dateOfSale: { $regex: `^${month}`, $options: 'i' }
    };

    const transactions = await ProductTransaction.find(query)
      .skip((page - 1) * perPage)
      .limit(perPage);
    
    const total = await ProductTransaction.countDocuments(query);

    res.status(200).json({ transactions, total, page, perPage });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// 3. Get Statistics for Selected Month
router.get('/statistics', async (req, res) => {
  const { month } = req.query;
  
  try {
    const soldItems = await ProductTransaction.aggregate([
      { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' }, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: '$price' }, totalSold: { $sum: 1 } } }
    ]);
    
    const notSoldItems = await ProductTransaction.aggregate([
      { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' }, sold: false } },
      { $group: { _id: null, totalNotSold: { $sum: 1 } } }
    ]);

    res.status(200).json({
      totalSaleAmount: soldItems[0]?.totalAmount || 0,
      totalSoldItems: soldItems[0]?.totalSold || 0,
      totalNotSoldItems: notSoldItems[0]?.totalNotSold || 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// 4. Get Bar Chart Data for Selected Month
router.get('/bar-chart', async (req, res) => {
  const { month } = req.query;

  try {
    const priceRanges = [
      { min: 0, max: 100 },
      { min: 101, max: 200 },
      { min: 201, max: 300 },
      { min: 301, max: 400 },
      { min: 401, max: 500 },
      { min: 501, max: 600 },
      { min: 601, max: 700 },
      { min: 701, max: 800 },
      { min: 801, max: 900 },
      { min: 901, max: Infinity }
    ];

    const barChartData = await Promise.all(priceRanges.map(async (range) => {
      const count = await ProductTransaction.countDocuments({
        price: { $gte: range.min, $lte: range.max },
        dateOfSale: { $regex: `^${month}`, $options: 'i' }
      });
      return { range: `${range.min}-${range.max}`, count };
    }));

    res.status(200).json(barChartData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bar chart data' });
  }
});

// 5. Get Pie Chart Data for Selected Month
router.get('/pie-chart', async (req, res) => {
  const { month } = req.query;

  try {
    const categories = await ProductTransaction.aggregate([
      { $match: { dateOfSale: { $regex: `^${month}`, $options: 'i' } } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pie chart data' });
  }
});

// 6. Combine Data from All APIs
router.get('/combined-data', async (req, res) => {
  const { month } = req.query;

  try {
    const [statistics, barChartData, pieChartData] = await Promise.all([
      axios.get(`/statistics?month=${month}`),
      axios.get(`/bar-chart?month=${month}`),
      axios.get(`/pie-chart?month=${month}`)
    ]);

    res.status(200).json({
      statistics: statistics.data,
      barChartData: barChartData.data,
      pieChartData: pieChartData.data
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch combined data' });
  }
});

module.exports = router;
