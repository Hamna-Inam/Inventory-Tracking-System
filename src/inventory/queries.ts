export const selectItemById = 'SELECT * FROM inventory WHERE id = ?';
export const updateItemQuantity = 'UPDATE inventory SET quantity = quantity + ? WHERE id = ?';
export const insertItem = 'INSERT INTO inventory (id, name, quantity, price) VALUES (?, ?, ?, ?)';
export const insertStockMovement = 'INSERT INTO stock_movements (item_id, date, quantity, type) VALUES (?, ?, ?, ?)';
export const getAllItems = `SELECT * FROM inventory`;

export const createTables =`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id INTEGER NOT NULL,
      type TEXT CHECK(type IN ('stock-in', 'sale', 'removal')),
      quantity INTEGER NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Auto-set date
      FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
    );`