// controllers/productController.js
const axios = require('axios');
const Product = require('../models/Product');

// Initialize database by fetching seed data
exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        if (!response.data || !Array.isArray(response.data)) {
            return res.status(400).json({ error: 'Invalid data from third-party API' });
        }
        
        await Product.deleteMany({});
        await Product.insertMany(response.data);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        console.error('Error initializing database:', error);
        res.status(500).json({ error: 'Error initializing the database' });
    }
};


// Get all transactions with search and pagination
const mongoose = require('mongoose');

exports.getTransactions = async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    const limit = parseInt(perPage, 10);
    const skip = (page - 1) * limit;
    const monthNumber = parseInt(month, 10);

    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ error: 'Invalid month' });
    }

    try {
        const query = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ],
            $expr: { $eq: [{ $month: "$dateOfSale" }, monthNumber] },
        };

        const transactions = await Product.find(query).skip(skip).limit(limit);
        const total = await Product.countDocuments(query);

        res.json({ transactions, total });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Error fetching transactions' });
    }
};


// Get statistics for selected month
exports.getStatistics = async (req, res) => {
    const { month } = req.query;
    const monthRegex = `-${month}-`;

    try {
        const soldItems = await Product.countDocuments({
            sold: true,
            dateOfSale: { $regex: monthRegex, $options: 'i' }
        });

        const notSoldItems = await Product.countDocuments({
            sold: false,
            dateOfSale: { $regex: monthRegex, $options: 'i' }
        });

        const totalSaleAmount = await Product.aggregate([
            {
                $match: {
                    sold: true,
                    dateOfSale: { $regex: monthRegex, $options: 'i' }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$price" }
                }
            }
        ]);

        res.json({
            totalSaleAmount: totalSaleAmount[0]?.total || 0,
            soldItems,
            notSoldItems
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Error fetching statistics' });
    }
};


// Get price range stats for bar chart
exports.getPriceRangeStats = async (req) => {
    const { month } = req.query;
    const ranges = [
        [0, 100], [101, 200], [201, 300], [301, 400], [401, 500],
        [501, 600], [601, 700], [701, 800], [801, 900], [901, Infinity]
    ];

    try {
        const priceRanges = await Promise.all(
            ranges.map(async ([min, max]) => {
                const count = await Product.countDocuments({
                    price: { $gte: min, $lte: max === Infinity ? Number.MAX_VALUE : max },
                    dateOfSale: { $regex: `-${month}-`, $options: 'i' }
                });
                return { range: `${min}-${max}`, count };
            })
        );

        return priceRanges; // Return the result instead of sending a response
    } catch (error) {
        throw new Error('Error fetching price range stats'); 
        
    }
};

// Get unique categories for pie chart
exports.getCategoryStats = async (req, res) => {
    const { month } = req.query;
    const monthRegex = `-${month}-`;

    try {
        const categoryStats = await Product.aggregate([
            {
                $match: {
                    dateOfSale: { $regex: monthRegex, $options: 'i' }
                }
            },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
        ]);

        res.json(categoryStats);
    } catch (error) {
        console.error('Error fetching category stats:', error);
        res.status(500).json({ error: 'Error fetching category stats' });
    }
};


// Combined API response
exports.getCombinedStats = async (req, res) => {
    try {
        const statistics = await exports.getStatistics(req);
        const priceRanges = await exports.getPriceRangeStats(req);
        const categories = await exports.getCategoryStats(req);

        res.json({
            statistics,
            priceRanges,
            categories,
        });
    } catch (error) {
        console.error('Error fetching combined data:', error);
        res.status(500).json({ error: 'Error fetching combined data' });
    }
};

