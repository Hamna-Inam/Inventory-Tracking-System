import express from "express";
import router from "./router";
import dotenv from 'dotenv';
import createTables from "./inventory/dbInit";
import limiter from "./middleware";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(limiter);

try {
createTables();
}
catch(err){
  console.log(err);
}


app.use('/',router);


app.listen(PORT , ()=> {
    console.log(`Server listening at port ${PORT}`);

});