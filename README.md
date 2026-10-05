# 📦 Sterling Courier

A full-stack courier management web application built with **Node.js, Express.js, MongoDB, Mongoose, HTML, and Bootstrap**.

Sterling Courier provides a simple dashboard for managing customers and courier orders. The application supports customer registration, courier booking, generated tracking IDs, order listing, status updates, and invoice-style order details.

---

## ✨ Features

- 👤 Customer registration
- 📦 Courier order booking
- 🆔 Automatic tracking ID generation
- 📋 View all courier orders
- 🔄 Update courier order status
- 📄 Generate/view invoice details
- 🗄️ MongoDB persistence using Mongoose
- 🌐 Express.js web server and REST-style endpoints
- 🎨 Bootstrap-based responsive forms and dashboards
- ✅ Basic client-side form validation
- 🛠️ Separate route and model structure for future expansion

---

## 🏗️ Application Workflow

```text
                     Sterling Courier
                           │
                           ▼
                  Express.js Server
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
        Customers      Courier Orders   Admin
             │             │             │
             ▼             ▼             ▼
          MongoDB       MongoDB       Status Update
             │             │             │
             └─────────────┼─────────────┘
                           ▼
                    Order Information
                           │
                           ▼
                        Invoice
```

### Typical Order Flow

1. A customer can be registered in the system.
2. A courier order is submitted with sender, recipient, address, weight, and contact information.
3. The server generates a tracking ID such as `SCL123456`.
4. The order is stored in MongoDB with a default **Booked** status.
5. Orders can be viewed from the orders page.
6. An administrator can change the status to **In Transit**, **Delivered**, or **Cancelled**.
7. An invoice page can be opened using the generated tracking ID.

---

## 🛠️ Tech Stack

### Backend
- **Node.js**
- **Express.js**
- **Mongoose**
- **MongoDB**

### Frontend
- HTML5
- CSS/Bootstrap 5
- JavaScript
- Bootstrap CDN

### Templating / Structure
- EJS view template
- Express static files
- Modular route and model folders

---

## 📁 Project Structure

```text
Sterling-courier/
│
├── models/
│   └── Customer.js
│
├── public/
│   ├── admin-update.html
│   ├── book-order.html
│   ├── order-success.html
│   └── register.html
│
├── routes/
│   ├── admin.js
│   ├── customer.js
│   ├── index.js
│   ├── order.js
│   └── user.js
│
├── views/
│   └── main.ejs
│
├── playground-1.mongodb.js
├── playground-2.mongodb.js
├── server.js
└── README.md
```

> The current repository also contains some route/model files that act as scaffolding for extending the application's architecture.

---

## 🗄️ Database

The project uses a local MongoDB database named:

```text
sterlingCourierDB
```

The current server configuration connects to:

```text
mongodb://127.0.0.1:27017/sterlingCourierDB
```

### Main data collections

#### Customers

The customer model contains information such as:

- Name
- Email
- Date of registration
- Address
- City
- PIN
- Phone

The email field is configured as unique.

#### Courier Orders

Courier orders contain:

- Tracking ID
- Sender name
- Recipient name
- Pickup address
- Delivery address
- Weight
- Contact number
- Status
- Creation date

The default order status is:

```text
Booked
```

---

## 📋 Supported Order Statuses

| Status | Meaning |
|---|---|
| 🟡 **Booked** | Order has been created |
| 🔵 **In Transit** | Shipment is currently being transported |
| 🟢 **Delivered** | Shipment has reached the destination |
| 🔴 **Cancelled** | Shipment has been cancelled |

---

## 🔌 Main Endpoints

### Homepage

```http
GET /
```

Displays the Sterling Courier dashboard with links to customer registration, courier booking, orders, and the admin status panel.

### Register Customer

```http
POST /register
```

Registers a new customer in MongoDB.

### Book Courier

```http
POST /book-order
```

Creates a courier order and generates a tracking ID.

Example tracking ID:

```text
SCL482193
```

### View Orders

```http
GET /orders
```

Retrieves stored courier orders and displays them in a Bootstrap table.

### Update Order Status

```http
POST /update-status
```

Updates the status of an existing order using its tracking ID.

### Invoice

```http
GET /invoice/:trackingId
```

Displays the stored details of a courier order as an invoice-style page.

---

## 🚀 Getting Started

### Prerequisites

Install the following before running the project:

- **Node.js**
- **npm**
- **MongoDB Community Server** or another local MongoDB instance
- A browser such as Chrome, Edge, or Firefox

Make sure MongoDB is running locally on:

```text
127.0.0.1:27017
```

---

### 1. Clone the repository

```bash
git clone https://github.com/Harshit765G4/Sterling-courier.git
cd Sterling-courier
```

### 2. Install dependencies

The repository does not currently include a `package.json`, so the required Node.js dependencies need to be installed manually.

```bash
npm init -y
npm install express mongoose ejs
```

### 3. Start MongoDB

Start your local MongoDB service.

The application expects:

```text
mongodb://127.0.0.1:27017/sterlingCourierDB
```

### 4. Run the application

```bash
node server.js
```

The server listens on:

```text
http://localhost:3000
```

Open that address in your browser.

---

## 🖥️ Available Pages

Once the server is running, the application provides pages such as:

| Page | Path | Purpose |
|---|---|---|
| Dashboard | `/` | Main Sterling Courier dashboard |
| Register Customer | `/register.html` | Add a customer |
| Book Courier | `/book-order.html` | Create a courier order |
| Orders | `/orders` | View all orders |
| Admin Panel | `/admin-update.html` | Change order status |
| Invoice | `/invoice/:trackingId` | View order invoice |

---

## 🧪 MongoDB Playground Queries

The repository includes two MongoDB helper scripts.

### View courier orders

```javascript
use('sterlingCourierDB');

db.getCollection('courierorders').find().pretty();
```

### View customers

```javascript
use('sterlingCourierDB');

db.getCollection('customers').find().pretty();
```

These can be run from MongoDB Compass or a MongoDB shell environment.

---

## 🔐 Security Considerations

This project is intended as a learning/full-stack development project and should be hardened before production use.

Recommended improvements include:

- Move the MongoDB connection string into environment variables.
- Add authentication and authorization for the admin panel.
- Validate and sanitize all server-side inputs.
- Avoid generating tracking IDs with a simple random number alone.
- Escape user-supplied values before inserting them into generated HTML.
- Add rate limiting and request logging.
- Use HTTPS in production.
- Add centralized error handling.
- Validate allowed order-status transitions.
- Protect customer and shipment data from unauthorized access.

> The current admin status-update page does not implement authentication, so it should not be exposed publicly without additional security controls.

---

## ⚠️ Current Project Notes

The repository is a working development project, but some parts are still evolving.

- The main application logic is concentrated in `server.js`.
- Additional `routes/` and `models/` files provide a more modular structure but are not fully integrated into the main server flow.
- The local MongoDB connection is hard-coded in `server.js`.
- There is currently no `package.json` committed to the repository.
- Authentication and role-based authorization are not implemented.
- Order tracking is based on the generated tracking ID rather than a dedicated public tracking API.

---

## 🔮 Future Improvements

- 🔐 User authentication and admin login
- 📍 Public shipment tracking
- 🗺️ Live delivery tracking
- 📊 Admin analytics dashboard
- 📱 Responsive mobile-first redesign
- 💳 Online payment integration
- 📧 Email notifications
- 💬 SMS/WhatsApp shipment notifications
- 🧾 Downloadable PDF invoices
- 🔍 Advanced order search and filtering
- 👥 Customer order history
- 🚚 Delivery-agent management
- 📦 Package/parcel inventory management
- ☁️ Deployment with a cloud MongoDB database
- 🐳 Docker support
- 🧪 Automated testing
- ⚙️ Environment-variable configuration

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application locally.
5. Commit your changes.
6. Open a pull request.

---

## 📄 License

This repository currently does not contain a dedicated `LICENSE` file.

Add an appropriate open-source license before distributing the project for broader reuse.

---

## 👨‍💻 Author

**Harshit Garg**

GitHub: [@Harshit765G4](https://github.com/Harshit765G4)

Repository: [Sterling Courier](https://github.com/Harshit765G4/Sterling-courier)

---

⭐ If you find this project useful, consider giving it a star!
