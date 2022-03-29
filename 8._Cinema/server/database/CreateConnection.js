import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

 // open the database
export const db = await open({
    filename: './database/cinema.db',
    driver: sqlite3.Database
})