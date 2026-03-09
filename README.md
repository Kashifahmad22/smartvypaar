# SmartVyapaar

### Digital Business Operating System for Small Businesses

SmartVyapaar is a **modern business management platform** designed for **small and medium enterprises (SMEs)**. It helps business owners manage **inventory, sales, customer ledgers, and analytics** from a single dashboard.

The goal of SmartVyapaar is to **replace traditional manual bookkeeping systems** with a **simple, intelligent, and data-driven digital platform**.

---

# Problem Statement

Many small businesses still manage their operations using:

* Paper registers
* Manual ledger books
* Excel spreadsheets
* Multiple disconnected software tools

This results in:

* Poor inventory tracking
* Errors in financial records
* No real-time business insights
* Difficulty managing credit transactions
* Inefficient decision-making

SmartVyapaar solves these challenges by providing **a unified digital platform to manage the entire business workflow**.

---

# Key Features

## Inventory Management

The inventory module helps businesses track and manage products efficiently.

**Features**

* Add new products
* Track product stock
* Manage product batches
* Update product details
* Delete products
* Monitor stock levels

---

## Sales Management

The sales module records transactions and automatically updates inventory.

**Features**

* Record sales transactions
* Calculate total sale value
* Update inventory automatically
* Store transaction history

---

## Customer Ledger (Digital Khata)

This module digitizes the traditional **khata system** used by many shop owners.

**Features**

* Add customers
* Record credit transactions
* Track payments
* Calculate outstanding balances

---

## Business Analytics

SmartVyapaar provides insights into business performance through analytics.

**Analytics include**

* Daily revenue
* Monthly sales reports
* Product performance
* Sales trends

---

## Dashboard

The dashboard provides a **quick overview of business performance**.

It displays:

* Total revenue
* Number of sales
* Inventory status
* Sales charts
* Business performance metrics

---

# Tech Stack

### Frontend

* React.js
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Architecture

* REST API based client-server architecture

---

# System Architecture

SmartVyapaar follows a **three-layer architecture**.

### Presentation Layer

User interface built with React that allows users to interact with the system.

### Application Layer

Backend server built with Node.js and Express that handles business logic and API communication.

### Data Layer

MongoDB Atlas stores application data including products, sales transactions, and customer records.

---

# Project Structure

```
smartvyapaar
│
├── frontend
│   ├── components
│   ├── pages
│   │   ├── Dashboard
│   │   ├── Inventory
│   │   ├── Sales
│   │   ├── Ledger
│   ├── services
│   └── App.js
│
├── backend
│   ├── controllers
│   │   ├── productController.js
│   │   ├── salesController.js
│   │   ├── ledgerController.js
│   │   └── analyticsController.js
│
│   ├── models
│   │   ├── Product.js
│   │   ├── Batch.js
│   │   ├── Sale.js
│   │   └── Party.js
│
│   ├── routes
│   │   ├── productRoutes.js
│   │   ├── salesRoutes.js
│   │   ├── ledgerRoutes.js
│   │   └── analyticsRoutes.js
│
│   └── server.js
│
└── database
    └── MongoDB Atlas
```

---

# Getting Started

## Clone the Repository

```bash
git clone https://github.com/yourusername/smartvyapaar.git
cd smartvyapaar
```

---

## Backend Setup

Install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run backend server:

```bash
npm start
```

Backend will run on:

```
http://localhost:5000
```

---

## Frontend Setup

Install dependencies:

```bash
cd frontend
npm install
```

Run frontend:

```bash
npm start
```

Frontend will run on:

```
http://localhost:3000
```

---

# API Overview

## Inventory APIs

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | /products     | Get all products |
| POST   | /products     | Add new product  |
| PUT    | /products/:id | Update product   |
| DELETE | /products/:id | Delete product   |

---

## Sales APIs

| Method | Endpoint | Description     |
| ------ | -------- | --------------- |
| POST   | /sales   | Record new sale |
| GET    | /sales   | Get all sales   |

---

## Ledger APIs

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | /ledger  | Add ledger transaction |
| GET    | /ledger  | Fetch ledger records   |

---

## Analytics APIs

| Method | Endpoint   | Description            |
| ------ | ---------- | ---------------------- |
| GET    | /analytics | Get business analytics |

---

# Future Enhancements

SmartVyapaar can evolve into a full **business operating system** with features like:

* AI-based business insights
* Demand prediction
* Automated inventory suggestions
* SaaS multi-tenant architecture
* Mobile application
* SmartVyapaar hardware device for shop counters

---

# Contributors

### Kashif Ahmed

Project Architecture & Backend Development

### Bharat

Frontend Development & UI Design

### Kunal

Database Management & Data Storage

---

# License

This project is developed for **academic and educational purposes**.

---

⭐ If you like the project, consider giving it a star.
