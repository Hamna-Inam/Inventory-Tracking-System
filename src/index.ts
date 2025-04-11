import express from "express";
import router from "./router";
import dotenv from 'dotenv';
import {createTables, enableSharding} from "./inventory/dbInit";
import limiter from "./middleware";
import { startConsumer } from "./queue/consumer";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(limiter);

// Initialize database and start consumer
const initializeApp = async () => {
    try {
        await createTables();
        //await enableSharding();
        await startConsumer();
        console.log('Consumer started successfully');
    } catch (err) {
        console.error('Error during initialization:', err);
    }
};

initializeApp();

app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`);
});