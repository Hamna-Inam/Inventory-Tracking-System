import express from "express";
import { AddInventory, GetAllItems, RemoveItem } from "../controllers";

const router = express.Router();

router.post("/add", AddInventory);
router.get("/getAll", GetAllItems);
router.delete("/remove",RemoveItem);

export default router;