import express from "express";
import { AddProduct, AddStock, AddStore, DeleteProduct, DeleteStock, DeleteStore, GetAllProducts, GetAllStock, GetAllStores, GetProductById, GetStore, GetStoreStock, UpdateProduct, UpdateStock, UpdateStore } from "../controllers";
import { basicAuth } from "../middleware";

const router = express.Router();

router.post("/add-product", basicAuth, AddProduct);
router.get("/get-products",basicAuth,GetAllProducts);
router.get("/get-product/:id", basicAuth,GetProductById);
router.delete("/delete-product/:id",basicAuth,DeleteProduct);
router.put('/update-product/',basicAuth,UpdateProduct)
router.post("/add-stock",basicAuth,AddStock);
router.get("/get-store-stock/:id",basicAuth,GetStoreStock);
router.put("/update-store-stock",basicAuth,UpdateStock);
router.get("/get-stock/",basicAuth,GetAllStock);
router.post("/add-store", basicAuth,AddStore);
router.get("/get-stores", basicAuth,GetAllStores);
router.get("/get-store/:id", basicAuth,GetStore);
router.put("/update-store/:id", basicAuth,UpdateStore);
router.delete("/delete-store/:id",basicAuth, DeleteStore);
router.delete("/delete-stock/:id",basicAuth, DeleteStock);


export default router;