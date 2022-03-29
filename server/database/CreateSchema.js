import { db } from './Connection.js';
import bcrypt from "bcrypt";

const deleteMode = process.env.DELETE_MODE || false;

if (deleteMode === 'true') {
    db.exec('DROP TABLE IF EXISTS users')
    console.log('DROPPED DATABASE')
}

db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email  VARCHAR(254) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL DEFAULT 'user'
    )`
)

if (deleteMode === 'true') {
    const email = 'admin@test.dk';
    const password = await bcrypt.hash(process.env.ADMIN_PASS || '1234', 12);
    const role = 'admin'

    db.run(`INSERT INTO users (email, password, role) VALUES (?, ?, ?)`, [email, password, role]);
    console.log('ADMIN USER CREATED')
}

