const express = require('express');
const router = express.Router();

// Admin Panel Route
router.get('/', (req, res) => {
    res.send('Admin Panel');
});

module.exports = router;
