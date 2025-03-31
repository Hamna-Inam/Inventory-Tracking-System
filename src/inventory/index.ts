import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

const dbPromise = open({
  filename: "./inventory.db",
  driver: sqlite3.Database,
});

export default dbPromise;
