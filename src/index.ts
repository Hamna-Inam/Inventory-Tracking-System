import express from "express";
import router from "./router";
import { createTables } from "./inventory/queries";
import dbPromise from "./inventory";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function init() {
    const db = await dbPromise; 
    await db.exec(createTables);
    console.log("Database initialized!");
  }
  
init().catch(console.error);

app.use('/',router);


app.listen(PORT , ()=> {
    console.log(`Server listening at port ${PORT}`);

});