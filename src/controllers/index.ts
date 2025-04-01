import express from "express";
import { selectItemById, updateItemQuantity, insertItem, insertStockMovement, getAllItems } from "../inventory/queries";
import { InventoryItem, StockMovement } from "../types";
import db from "../inventory";
import { pool } from "../inventory/db";


export const AddInventory = async (req: express.Request, res: express.Response) => {
    try {
        //const db = await dbPromise;
        const { id, name, quantity, price } = req.body;

        if (!id || !name || !quantity || !price) {
            res.status(400).json({ error: "Missing required fields" });
        }

        db.get('SELECT * FROM inventory WHERE id = ?', [id], (err: Error | null, item: InventoryItem | undefined) => {

            if (err) {
                res.status(500).json({ error: err.message });
            }

            if (item) {
                db.run(updateItemQuantity, [quantity, id], (err: Error) => {
                    if (err) {
                        res.status(500).json({ error: err.message }); // Send response
                    }
                    console.log('3');

                    db.run(insertStockMovement, [id, new Date(), quantity, "stock-in"], (err: Error) => {
                        if (err) {
                            res.status(500).json({ error: err.message }); // Send response
                        }

                        res.json({ message: "Stock updated" });
                    });
                });
            } else {
                db.run(insertItem, [id, name, quantity, price], (err) => {
                    if (err) {
                        res.status(500).json({ error: err.message }); // Send response
                    }

                    db.run(insertStockMovement, [id, new Date(), quantity, "stock-in"], (err: Error) => {
                        if (err) {
                            res.status(500).json({ error: err.message }); // Send response
                        }

                        res.json({ message: "New item added" });
                    });
                });
            }
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};



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

