// src/db.ts
import sqlite3 from "sqlite3";

const db = new sqlite3.Database("inventory.db", (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        process.exit(1);
    }
    console.log("Connected to SQLite database");
});

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS inventory (
          id INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          price REAL NOT NULL
      )
  `);

  db.run(`
      CREATE TABLE IF NOT EXISTS stock_movements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          item_id INTEGER NOT NULL,
          date TEXT NOT NULL,
          quantity INTEGER NOT NULL,
          type TEXT NOT NULL,
          FOREIGN KEY (item_id) REFERENCES inventory(id)
      )
  `);

  console.log("Database tables ensured!");
});

export default db;
