import {pool} from "./db"; 

const createTables = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS stores (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE
        );

        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            price DECIMAL(10,2) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS stock (
            id SERIAL PRIMARY KEY,
            store_id INTEGER REFERENCES stores(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER NOT NULL
        );
    `;

    try {
        await pool.query(query);
        console.log("Tables created successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
};

export default createTables;
