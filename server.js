const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); // Serves HTML, CSS, etc.

// MongoDB connection 
mongoose.connect('mongodb://127.0.0.1:27017/sterlingCourierDB')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Courier Schema
const courierSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true },
  senderName: String,
  recipientName: String,
  pickupAddress: String,
  deliveryAddress: String,
  weight: Number,
  contactNumber: String,
  status: { type: String, default: 'Booked' },
  createdAt: { type: Date, default: Date.now }
});
const CourierOrder = mongoose.model('CourierOrder', courierSchema);

// Customer Schema
const customerSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  address: String,
  createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', customerSchema);

// Homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Sterling Courier Dashboard</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
      <div class="container py-5">
        <div class="text-center mb-4">
          <h1 class="fw-bold">📦 Sterling Courier Dashboard</h1>
          <p class="lead">Manage your courier operations with ease</p>
        </div>
        <div class="row row-cols-1 row-cols-md-2 g-4">
          <div class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">👤 Register Customer</h5>
                <p class="card-text">Add new customers to the system.</p>
                <a href="/register.html" class="btn btn-primary">Register</a>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">✍️ Book Courier</h5>
                <p class="card-text">Place a new courier order for delivery.</p>
                <a href="/book-order.html" class="btn btn-success">Book Order</a>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">📋 View All Orders</h5>
                <p class="card-text">See the list of all courier orders.</p>
                <a href="/orders" class="btn btn-info">View Orders</a>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">🛠️ Admin Panel</h5>
                <p class="card-text">Update order statuses and manage dispatches.</p>
                <a href="/admin-update.html" class="btn btn-dark">Admin Panel</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Register customer
app.post('/register', async (req, res) => {
  const { fullName, email, phone, address } = req.body;
  
  if (!fullName || !email || !phone || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.json({ message: 'Customer registered successfully', customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Customer registration failed' });
  }
});

// Book courier order
app.post('/book-order', async (req, res) => {
  const { senderName, recipientName, pickupAddress, deliveryAddress, weight, contactNumber } = req.body;
  
  try {
    const trackingId = 'SCL' + Math.floor(100000 + Math.random() * 900000);
    
    // Create the new order without customerId
    const order = new CourierOrder({
      senderName,
      recipientName,
      pickupAddress,
      deliveryAddress,
      weight,
      contactNumber,
      trackingId
    });

    await order.save();
    res.json({ message: 'Order booked successfully', trackingId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to book order' });
  }
});

// View orders
app.get('/orders', async (req, res) => {
  try {
    const orders = await CourierOrder.find().sort({ _id: -1 });
    let html = `
    <html>
    <head>
      <title>Courier Orders</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container mt-5">
      <h2 class="mb-4">📦 All Courier Orders</h2>
      <table class="table table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Tracking ID</th>
            <th>Sender</th>
            <th>Recipient</th>
            <th>Status</th>
            <th>Weight (kg)</th>
            <th>Delivery Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    orders.forEach(order => {
      html += `
        <tr>
          <td>${order.trackingId}</td>
          <td>${order.senderName}</td>
          <td>${order.recipientName}</td>
          <td><span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></td>
          <td>${order.weight}</td>
          <td>${order.deliveryAddress}</td>
          <td><a class="btn btn-sm btn-primary" href="/invoice/${order.trackingId}">Invoice</a></td>
        </tr>
      `;
    });

    html += `</tbody></table>
      <a class="btn btn-secondary mt-3" href="/admin-update.html">🔄 Update Order Status</a>
    </body>
    </html>
    `;
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send('Could not fetch orders');
  }
});

// Update status
app.post('/update-status', async (req, res) => {
  const { trackingId, newStatus } = req.body;
  
  if (!trackingId || !newStatus) {
    return res.status(400).send('Tracking ID and new status are required');
  }

  try {
    // Find the order by trackingId
    const order = await CourierOrder.findOne({ trackingId });
    
    if (!order) {
      console.log(`Order with tracking ID ${trackingId} not found`);
      return res.status(404).send('Order not found');
    }
    
    // Check if the status is already the same
    if (order.status === newStatus) {
      console.log(`Order status for ${trackingId} is already ${newStatus}`);
      return res.send('Order is already in the requested status');
    }
    
    // Update the status
    const result = await CourierOrder.updateOne({ trackingId }, { status: newStatus });
    
    if (result.modifiedCount === 0) {
      return res.status(404).send('Order not found or already updated');
    }

    res.send('Status updated successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Update failed');
  }
});

// Invoice
app.get('/invoice/:trackingId', async (req, res) => {
  try {
    const order = await CourierOrder.findOne({ trackingId: req.params.trackingId });
    if (!order) return res.status(404).send('Invoice not found');
    res.send(`
      <html>
      <head>
        <title>Invoice - ${order.trackingId}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
      </head>
      <body class="container mt-5">
        <h2>📄 Invoice</h2>
        <div class="card p-4 shadow">
          <h4>Tracking ID: ${order.trackingId}</h4>
          <p><strong>Sender:</strong> ${order.senderName}</p>
          <p><strong>Recipient:</strong> ${order.recipientName}</p>
          <p><strong>Pickup Address:</strong> ${order.pickupAddress}</p>
          <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
          <p><strong>Weight:</strong> ${order.weight} kg</p>
          <p><strong>Contact Number:</strong> ${order.contactNumber}</p>
          <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
          <hr />
          <p class="text-end"><em>Thank you for using Sterling Courier!</em></p>
        </div>
        <a href="/orders" class="btn btn-secondary mt-3">🔙 Back to Orders</a>
      </body>
      </html>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading invoice');
  }
});

// Helper for badge color
function getStatusColor(status) {
  switch (status) {
    case 'Booked': return 'warning';
    case 'In Transit': return 'info';
    case 'Delivered': return 'success';
    case 'Cancelled': return 'danger';
    default: return 'secondary';
  }
}

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
