import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const db = await open({
    filename: './database/database.db',
    driver: sqlite3.Database
});

export {db}