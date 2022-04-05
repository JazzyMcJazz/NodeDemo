// import sqlite3 from 'sqlite3'
// import { open } from 'sqlite'
import mysql from 'mysql';
import 'dotenv/config';

 // open the database
// export const db = await open({
//     filename: './database/cinema.db',
//     driver: sqlite3.Database
// })

let conn;
export default conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});
