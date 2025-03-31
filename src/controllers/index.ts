import express from "express";
import { selectItemById, updateItemQuantity, insertItem, insertStockMovement, getAllItems } from "../inventory/queries";
import { InventoryItem, StockMovement } from "../types";
import dbPromise from "../inventory";

export const AddInventory =  async (req: express.Request, res: express.Response ) => {

    const db = await dbPromise; 

    const { id, name, quantity, price } = req.body;

    if (!id || !name || !quantity || !price ){
        res.status(400).json({
            error: "Missing required fields"
        });
    }

    db.get(selectItemById,[id], (err: Error ,item: InventoryItem) => {
        if (err) {
            return res.status(500).json({
            error: err.message
        });
    }
        if (item){

        db.run(updateItemQuantity, [quantity,id], (err: Error)=> {
            if (err) res.json({ message: "Stock updated" });

            db. run(insertStockMovement,[id, new Date(), quantity, 'stock-in'])
            res.json({ message: "Stock updated" });

        } );
        }

        else {

            db.run(insertItem, [id,name,quantity,price] , (err) => {
                if (err) return res.status(500).json({ error: err.message });
                db.run(insertStockMovement, [id, new Date(), quantity, "stock-in"]);
                res.json({ message: "New item added" });
            });

        }
    });

}


export const GetAllItems = async (req: express.Request, res: express.Response) => {

    const db = await dbPromise; 

    db.get( getAllItems, (err: Error ,Inventory: InventoryItem[]) => {
        res.status(200).json(Inventory);
    } );
};

export const RemoveItem = async (req:express.Request, res: express.Response) => {

    const db = await dbPromise; 

    const { id, quantity, type } = req.body; 

    db.get(selectItemById, [id], (err, item) => {
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



    /*

    let item = inventory.find(item => item.id === id);

    if (!item) {
        res.status(404).json({ error: "Item not found" });
    }
    else {
    if (item.quantity < quantity) {
        res.status(400).json({ error: "Insufficient stock" });
    }

    item.quantity -= quantity;
    item.stockMovements.push({
        date: new Date(),
        quantity,
        type
    });

    res.status(200).json({
        message: "Item updated", item
    });
    }
};
*/
