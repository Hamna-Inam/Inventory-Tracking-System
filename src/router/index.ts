import express from "express";
import { AddProduct, AddStock, AddStore, DeleteProduct, DeleteStock, DeleteStore, GetAllProducts, GetAllStock, GetAllStores, GetProductById, GetStore, GetStoreStock, UpdateProduct, UpdateStock, UpdateStore } from "../controllers";

const router = express.Router();

router.post("/add-product", AddProduct);
router.get("/get-products", GetAllProducts);
router.get("/get-product/:id", GetProductById);
router.delete("/delete-product/:id",DeleteProduct);
router.put('/update-product/',UpdateProduct)
router.post("/add-stock",AddStock);
router.get("/get-store-stock/:id",GetStoreStock);
router.put("/update-store-stock",UpdateStock);
router.get("/get-stock/",GetAllStock);
router.post("/add-store", AddStore);
router.get("/get-stores", GetAllStores);
router.get("/get-store/:id", GetStore);
router.put("/update-store/:id", UpdateStore);
router.delete("/delete-store/:id", DeleteStore);
router.delete("/delete-stock/:id", DeleteStock);


export default router;