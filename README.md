# Inventory-Tracking-System
# Stage 1

A simple REST API built with **Node.js**, **Express**, and **SQLite** to manage inventory items (products) and track stock movements. This is the first stage of a scalable inventory management solution.

---

## Tech Stack

- **Node.js** (Express)
- **SQLite** (File-based local DB)
- **TypeScript**

---

## Features (Stage 1)

- Add inventory items
- View all inventory
- Remove items manually or by sale
- Track stock movements (stock-in, sale, manual removal)
- Uses SQLite to persist data

---

## Database Schema

Two tables:

### `inventory`
| Column   | Type     | Description                |
|----------|----------|----------------------------|
| `id`     | INTEGER  | Primary Key (Product ID)   |
| `name`   | TEXT     | Product Name               |
| `quantity` | INTEGER | Current stock level        |
| `price`  | REAL     | Unit price of the product  |

### `stock_movements`
| Column   | Type     | Description                      |
|----------|----------|----------------------------------|
| `id`     | INTEGER  | Auto-incremented movement ID     |
| `item_id` | INTEGER | Foreign key to `inventory` table |
| `date`   | TEXT     | Date of movement                 |
| `quantity` | INTEGER | Quantity added or removed        |
| `type`   | TEXT     | 'stock-in', 'sale', or 'removal' |

---

## API Endpoints

| Method | Endpoint        | Description                        |
|--------|------------------|------------------------------------|
| POST   | `/add-item`      | Adds new item or updates quantity  |
| GET    | `/items`         | Returns all inventory items        |
| POST   | `/remove-item`   | Removes stock manually or by sale  |

All responses are returned in JSON.

---

## Design Overview

- Basic controller-based structure (`AddInventory`, `RemoveItem`, `GetAllItems`)
- SQLite initialized via `src/db.ts`
- `stock_movements` table maintains an audit trail for all stock changes
- Error handling for:
  - Duplicate items
  - Insufficient stock
  - Missing required fields


