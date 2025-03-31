import express from "express";
import router from "./router";
import { createTables } from "./inventory/queries";
import dbPromise from "./inventory";
import sqlite3 from "sqlite3";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/',router);

app.listen(PORT , ()=> {
    console.log(`Server listening at port ${PORT}`);

});