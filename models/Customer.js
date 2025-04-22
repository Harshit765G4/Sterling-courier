const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfRegistration: { type: String, required: true }, // Accepting "10-Jul-2022" format as string
  address: { type: String, required: true },
  city: { type: String, required: true },
  pin: { type: String, required: true },
  phone: { type: String, required: true },
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
