# Inventory-Tracking-System
In stage 2, the stock keeps track of quantity only
In stage 3, sharding: Products table: Created as a reference table (replicated to all nodes) because:
Product data is likely to be accessed by all stores
Product data is typically smaller in volume than transaction data
This enables efficient joins with the products table from any node

For logging, added a log table in the database which runs in the consumer
For concurrent requests, lock the rows with a dedicated client