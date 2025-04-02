export const addProduct = `INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *`;
export const getAllProducts = `SELECT * FROM products`;
export const getProductById = `SELECT * FROM products WHERE id = $1`;
export const updateProduct = `UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *`;
export const deleteProduct=`DELETE FROM products WHERE id = $1 RETURNING *`;
export const addStock = `INSERT INTO stock (store_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *`;
export const getStoreStock = `SELECT * FROM stock WHERE store_id = $1;`
export const updateStock = `UPDATE stock SET quantity = $1 WHERE store_id = $2 AND product_id = $3 RETURNING *`;
export const deleteStock = `DELETE FROM stock WHERE id = $1 RETURNING *`;
export const getAllStock = `SELECT * FROM stock`;
export const addStore = `INSERT INTO stores (name, address) VALUES ($1,$2) RETURNING *`;
export const getAllStores = `SELECT * FROM stores`;
export const getStoreById = `SELECT * FROM stores WHERE id = $1`;
export const updateStore = `UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *`;
export const deleteStore=`DELETE FROM stores WHERE id = $1 RETURNING *`;
export const getFilteredStock = `
    SELECT * FROM stock
    WHERE ($1::INTEGER IS NULL OR store_id = $1)
    AND ($2::TIMESTAMP IS NULL OR last_updated <= $2)
    AND ($3::TIMESTAMP IS NULL OR last_updated >= $3)
    ORDER BY last_updated DESC;
`;
