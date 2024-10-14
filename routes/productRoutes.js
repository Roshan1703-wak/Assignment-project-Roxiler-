// routes/productRoutes.js
const express = require('express');
const {
    initializeDatabase,
    getTransactions,
    getStatistics,
    getPriceRangeStats,
    getCategoryStats,
    getCombinedStats
} = require('../controllers/productController');

const router = express.Router();

router.get('/initialize', initializeDatabase);
router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/price-ranges', getPriceRangeStats);
router.get('/categories', getCategoryStats);
router.get('/combined', getCombinedStats);

router.get('/', (req, res) => {
    res.json({
        message: 'Available endpoints: /initialize, /transactions, /statistics, /price-ranges, /categories, /combined'
    });
});


module.exports = router;
