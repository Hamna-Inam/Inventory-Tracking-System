import express from "express";
import { pool } from "../inventory/db";
import { addProduct, getAllProducts, getProductById, updateProduct, getStoreStock, deleteProduct, addStock, updateStock, getAllStock, addStore, getAllStores, getStoreById, updateStore, deleteStore, deleteStock, getFilteredStock } from "../inventory/queries";
import { publishEvent } from "../queue/publisher";

export const AddProduct = async (req: express.Request, res: express.Response) => {
    const {name, price} = req.body;
    const client = await pool.connect();


    if (!name || !price ) {
        res.status(400).json({
            error:"Missing required fields"
        });
    }
    try {

        await client.query('BEGIN');

        const result = await pool.query(
            addProduct,
            [name, price]
        );

        await client.query('COMMIT');

        await publishEvent('ADD_PRODUCT', {
            id: result.rows[0].id,
            name,
            price
          });

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Error adding product" });
    }
    finally {
        client.release();
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
        else {

            await publishEvent('UPDATE_PRODUCT', {
                id: result.rows[0].id,
                name,
                price
              });    
            
            res.json(result.rows[0]);}
    } catch (error) {
        res.status(500).json({ error: "Error updating product" });
    }
};

export const DeleteProduct = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(deleteProduct, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Product not found" });
        else {

            await publishEvent('DELETE_PRODUCT', {
                id: result.rows[0].id,
              });
            
            res.json({ message: "Product deleted" });
    
    }
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
        await publishEvent('ADD_STOCK', {
            id: result.rows[0].id,
            store_id, product_id, quantity
          });
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
    const { store_id, product_id, quantity} = req.body;
    try {
        const result = await pool.query(
            updateStock,
            [quantity, store_id, product_id]
        );

        if (result.rows.length === 0) res.status(404).json({ error: "Stock not found" });
        else {

            await publishEvent('UPDATE_STOCK', {
                id: result.rows[0].id,
                store_id, product_id, quantity
              });
            
            res.json(result.rows[0]);

        }
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

        await publishEvent('ADD_STORE', {
            id: result.rows[0].id, name, address
          });

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
        else 
        {
            await publishEvent('UPDATE_STORE', {
                id, name, address
              });

            res.json(result.rows[0]);
        }
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
        else {

            await publishEvent('DELETE_STORE', {
                id
              });
            
            
            res.json({ message: "Store deleted" });
    
    }
    } catch (error) {
        res.status(500).json({ error: "Error deleting store" });
    }
};


export const DeleteStock = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(deleteStock, [id]);
        if (result.rows.length === 0) res.status(404).json({ error: "Stock not found" });
        else {

            await publishEvent('DELETE_STOCK', {
                id
              });
            
            res.json({ message: "Stock deleted" });
    }
    } catch (error) {
        res.status(500).json({ error: "Error deleting Stock" });
    }
};

export const GetFilteredStock = async (req: express.Request, res: express.Response) => {

    const { storeId, beforeDate, afterDate } = req.query;

    try {
        const result = await pool.query(getFilteredStock, [
            storeId ? Number(storeId) : null,
            beforeDate ? new Date(beforeDate as string) : null,
            afterDate ? new Date(afterDate as string) : null
        ]);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching filtered stock data" });
    }
};