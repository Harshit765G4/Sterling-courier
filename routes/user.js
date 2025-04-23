const express = require('express');
const router = express.Router();

// User Login Route
router.get('/login', (req, res) => {
    res.send('User Login Page');
});

module.exports = router;
