# Inventory Management System - Stage 2

In Stage 2, the system evolves into a multi-store inventory tracking platform using **PostgreSQL**, with support for filtering, reporting, and basic security.

---

## Tech Stack

- **Node.js** + **Express**
- **PostgreSQL**
- **TypeScript**
- **REST API**
- **Rate Limiting + Basic Auth**

---

## Key Features

- Support for **500+ stores**
- Central **Product Catalog**
- Store-specific **Stock Management**
- Full **CRUD operations** for:
  - Products
  - Stores
  - Stock
- Stock filtering by **store** and **date range**
- Basic authentication
- Request throttling (via middleware)
- PostgreSQL connection pooling

---

##  PostgreSQL Schema Overview

- `products (id, name, price)`
- `stores (id, name, address)`
- `stock (id, store_id, product_id, quantity, last_updated)`

---

##  API Endpoints

###  Products
| Method | Route               | Description             |
|--------|---------------------|-------------------------|
| POST   | `/add-product`      | Add a new product       |
| GET    | `/get-products`     | Get all products        |
| GET    | `/get-product/:id`  | Get a product by ID     |
| PUT    | `/update-product`   | Update product info     |
| DELETE | `/delete-product/:id` | Delete a product      |

---

###  Stores
| Method | Route               | Description            |
|--------|---------------------|------------------------|
| POST   | `/add-store`        | Add a store            |
| GET    | `/get-stores`       | Get all stores         |
| GET    | `/get-store/:id`    | Get a store by ID      |
| PUT    | `/update-store/:id` | Update store info      |
| DELETE | `/delete-store/:id` | Delete a store         |

---

###  Stock
| Method | Route                    | Description                             |
|--------|--------------------------|-----------------------------------------|
| POST   | `/add-stock`             | Add stock to a store                    |
| PUT    | `/update-store-stock`    | Update stock quantity                   |
| GET    | `/get-store-stock/:id`   | Get stock for a store                   |
| GET    | `/get-stock/`            | Get all stock records                   |
| GET    | `/get-filtered-stock`    | Filter stock by store & date range      |
| DELETE | `/delete-stock/:id`      | Delete stock entry                      |

---

##  Security & Throttling

- **Basic Auth Middleware** for protected routes
  - Auth header required: `Authorization: Basic <base64-encoded>`
- **Request throttling** using middleware (configurable)

---

##  Design Notes

- PostgreSQL replaces SQLite for relational scalability
- Product and stock info separated into normalized tables
- Uses a **central catalog** with per-store inventory
- Querying includes filtering for reporting needs 
- Considered integration with external API Gateway (e.g., NGINX), but handled routing internally via Express

---

##  Branch Info

| Stage   | GitHub Branch |
|---------|----------------|
| Stage 1 | `main`         |
| Stage 2 | `stage-2`      |
| Stage 3 | `stage-3`      |

---

## ⚠ Assumptions & Limitations

- Authentication is basic (can be upgraded to JWT/OAuth)
- No role-based access (e.g., admin vs staff)


