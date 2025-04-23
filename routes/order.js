const express = require('express');
const router = express.Router();

// Create Order Route
router.get('/create-order', (req, res) => {
    res.send('Create Order Page');
});

// View Orders Route
router.get('/view-orders', (req, res) => {
    res.send('View Orders Page');
});

// Track Order Route
router.get('/track-order', (req, res) => {
    res.send('Track Order Page');
});

module.exports = router;
