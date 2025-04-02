import express from "express";
import { pool } from "../inventory/db";
import { addProduct, getAllProducts, getProductById, updateProduct, getStoreStock, deleteProduct, addStock, updateStock, getAllStock, addStore, getAllStores, getStoreById, updateStore, deleteStore, deleteStock } from "../inventory/queries";

export const AddProduct = async (req: express.Request, res: express.Response) => {
    const {name, price} = req.body;

    if (!name || !price ) {
        res.status(400).json({
            error:"Missing required fields"
        });
    }
    try {
        const result = await pool.query(
            addProduct,
            [name, price]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error adding product" });
    }
};


export const GetAllProducts = async (req: express.Request, res: express.Response) => {
    try {
      const result = await pool.query(getAllProducts);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
    }
  };

  export const GetProductById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(getProductById, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Product not found" });
        else res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching product" });
    }
};

export const UpdateProduct = async (req: express.Request, res: express.Response) => {
    const {id ,name, price } = req.body;
    try {
        const result = await pool.query(
            updateProduct,
            [name, price, id]
        );
        if (result.rows.length === 0) res.status(404).json({ error: "Product not found" });
        else res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
};

export const DeleteProduct = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(deleteProduct, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Product not found" });
        else res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
};

export const AddStock = async (req: express.Request, res: express.Response) => {
    const { store_id, product_id, quantity } = req.body;
    try {
        const result = await pool.query(
            addStock,
            [store_id, product_id, quantity]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding stock" });
    }
};

export const GetStoreStock = async (req: express.Request, res: express.Response) => {
    const  storeId  = req.params.id;
    try {
        const result = await pool.query(
            getStoreStock,
            [storeId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching stock for this store" });
    }
};

export const UpdateStock = async (req: express.Request, res: express.Response) => {
    const { storeId, productId, quantity} = req.body;
    try {
        const result = await pool.query(
            updateStock,
            [quantity, storeId, productId]
        );
        if (result.rows.length === 0) res.status(404).json({ error: "Stock not found" });
        else res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error updating stock" });
    }
};

export const GetAllStock = async (req: express.Request, res: express.Response) => {
    try {
        const result = await pool.query(
            getAllStock,
        );
        if (result.rows.length === 0) res.status(404).json({ error: "Stock not found" });
        else res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error updating stock" });
    }
};


export const AddStore = async (req: express.Request, res: express.Response) => {
    const {name,address} = req.body;

    if (!name || !address ) {
        res.status(400).json({
            error:"Missing required fields"
        });
    }
    try {
        const result = await pool.query(
            addStore,
            [name,address]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error adding store" });
    }
};

export const GetAllStores = async (req: express.Request, res: express.Response) => {
    try {
      const result = await pool.query(getAllStores);
      if (result.rows.length === 0) res.status(404).json({ error: "Stores not found" });
      else res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: "Error fetching stores" });
    }
  };

  export const GetStore = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(getStoreById, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Store not found" });
        else res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error fetching store" });
    }
};

export const UpdateStore = async (req: express.Request, res: express.Response) => {
    const id = parseInt(req.params.id);
    const { name, address } = req.body;
    try {
        const result = await pool.query(
            updateStore,
            [name, address, id]
        );
        if (result.rows.length === 0) res.status(404).json({ error: "Store not found" });
        else res.json(result.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating store" });
    }
};


export const DeleteStore = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(deleteStore, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Store not found" });
        else res.json({ message: "Store deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting store" });
    }
};


export const DeleteStock = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(deleteStock, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Stock not found" });
        else res.json({ message: "Stock deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting Stock" });
    }
};







/*
export const GetAllItems = async (req: express.Request, res: express.Response) => {

   // const db = await dbPromise; 

    db.all( getAllItems, (err: Error ,Inventory: InventoryItem[]) => {
        res.status(200).json(Inventory);
    } );
};

export const RemoveItem = async (req:express.Request, res: express.Response) => {

    //const db = await dbPromise; 

    const { id, quantity, type } = req.body; 

    db.get(selectItemById, [id], (err, item: InventoryItem) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!item) return res.status(404).json({ error: "Item not found" });
      
        if (item.quantity < quantity) {
            return res.status(400).json({ error: "Insufficient stock" });
        }

        db.run(updateItemQuantity, [quantity, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Log stock movement
            db.run(insertStockMovement, 
                [id, new Date(), quantity, type]);

            res.json({ message: "Stock removed" });

        });
    });
};


*/