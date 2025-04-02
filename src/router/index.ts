import express from "express";
import { AddProduct, DeleteProduct, GetAllProducts, UpdateProduct } from "../controllers";
import { updateProduct } from "inventory/queries";

const router = express.Router();

router.post("/add-product", AddProduct);
router.get("/get-products", GetAllProducts);
router.delete("/delete-product/:id",DeleteProduct);
router.put('/update-product/:id',UpdateProduct)


export default router;