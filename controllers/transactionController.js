const Transaction = require('../models/transactionModel');
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean
});

module.exports = mongoose.model('Transaction', transactionSchema);


// Controller function to get transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find(); // Fetch all transactions
        
        // Calculate statistics
        const totalSaleAmount = transactions
            .filter(transaction => transaction.sold)
            .reduce((total, transaction) => total + transaction.price, 0);

        const soldItems = transactions.filter(transaction => transaction.sold).length;
        const notSoldItems = transactions.filter(transaction => !transaction.sold).length;

        // Price ranges (example ranges)
        const priceRanges = [
            { range: '0-500', count: transactions.filter(t => t.price <= 500).length },
            { range: '500-1000', count: transactions.filter(t => t.price > 500 && t.price <= 1000).length },
            { range: '1000-1500', count: transactions.filter(t => t.price > 1000 && t.price <= 1500).length },
            { range: '1500+', count: transactions.filter(t => t.price > 1500).length },
        ];

        // Get distinct categories
        const categories = [...new Set(transactions.map(t => t.category))];

        // Respond with the structured data
        res.json({
            transactions: transactions,
            statistics: {
                totalSaleAmount,
                soldItems,
                notSoldItems
            },
            priceRanges: priceRanges,
            categories: categories
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
};
