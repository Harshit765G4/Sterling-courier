const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// POST /api/customers
router.post('/', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.json({ message: 'Customer registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registering customer.' });
  }
});

module.exports = router;
