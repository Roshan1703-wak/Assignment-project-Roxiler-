const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Product API! Use /api/products to access data.');
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/productdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
