export interface StockMovement {
    type: 'stock-in' | 'sale' | 'removal';
    quantity : number;
    date : Date;
}

export interface InventoryItem {
    id: number;
    name: string;
    quantity : number;
    price: number;
    stockMovements : StockMovement[];
    category? : string,
    createdAt: Date;
}