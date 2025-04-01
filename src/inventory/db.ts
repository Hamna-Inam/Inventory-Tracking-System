import { Pool } from "pg";
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({ // create an instance of Pool
    user:process.env.PG_USER,
    host:process.env.PG_HOST,
    database:process.env.PG_NAME,
    password:process.env.PG_PASSWORD,
    port: 5432,
    ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

