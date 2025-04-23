const express = require('express');
const router = express.Router();

// Main dashboard route
router.get('/', (req, res) => {
    res.render('main');  // Render main.ejs
});

module.exports = router;
