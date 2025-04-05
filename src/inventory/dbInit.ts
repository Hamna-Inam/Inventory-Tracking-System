import {pool} from "./db"; 

export const createTables = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    UNIQUE (name,address),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


    CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stock (
    id SERIAL PRIMARY KEY,
    store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;
    try {
        await pool.query(query);
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error creating tables:", error);
    }

};

export const enableSharding = async() => {
    try {
        console.log('Enabling Citus extension');
        await pool.query(`CREATE EXTENSION IF NOT EXISTS citus;`);

        console.log(' Distributing tables across worker nodes');
        await pool.query(`SELECT create_distributed_table('stores', 'id');`);
        await pool.query(`SELECT create_reference_table('products')`);
        await pool.query(`SELECT create_distributed_table('stock', 'store_id');`);

        console.log('Adding worker nodes');
        const workerNodes = process.env.WORKER_NODES?.split(',') || [];
        for (const node of workerNodes) {
            console.log(`Adding worker node: ${node}`);
            await pool.query(`SELECT * FROM citus_add_node($1, 5432);`, [node]);
        }

        console.log('Database sharding initialized successfully!');
    } catch (error) {
        console.error('Error initializing sharding:', error);
    } 
}


