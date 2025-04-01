import express from "express";
import { routerpg } from "./router";
import dotenv from 'dotenv';
import { pool } from "./inventory/db";
import createTables from "./inventory/dbInit";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

try {
createTables();
}
catch(err){
  console.log(err);
}


app.use('/',routerpg);


app.listen(PORT , ()=> {
    console.log(`Server listening at port ${PORT}`);

});