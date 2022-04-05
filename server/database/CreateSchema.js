import { db } from './Connection.js';
import bcrypt from "bcrypt";
import fs from 'fs';

const deleteMode = process.env.DELETE_MODE || false;
const includeDummyData = process.env.INCLUDE_DUMMY_DATA || false;

if (deleteMode === 'true') {
    const sql = fs.readFileSync('./database/drop-database.sql').toString();
    await db.exec(sql)
    console.log('DROPPED DATABASE')
}

const sql = fs.readFileSync('./database/create-database.sql').toString();
await db.exec(sql)
console.log('CREATED DATABASE');


if (deleteMode === 'true') {
    const email = 'admin@test.dk';
    const password = await bcrypt.hash(process.env.ADMIN_PASS || '1234', 12);
    const role = 'admin'

    await db.run(`INSERT INTO user (email, password, role, verified) VALUES (?, ?, ?, ?)`, [email, password, role, 1]);
    console.log('ADMIN USER CREATED')
}

if (includeDummyData === 'true') {
    // dummy data
    const sql = fs.readFileSync('./database/insert-dummy-data.sql').toString();
    await db.exec(sql);

    // late dummy data to simulate later created_date for "new" courses
    setTimeout(async () => {
        await db.run(`INSERT INTO course (title, description, price, category_id) VALUES ('JavaScript with Bubber', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 23000, 1);`);
        await db.run(`INSERT INTO course (title, description, price, category_id) VALUES ('Jewelery Crafts with Angelina', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 4000, 2);`);
        await db.run(`INSERT INTO course (title, description, price, category_id) VALUES ('Furniture Design with Nicolai', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.', 16000, 2);`)

        console.log('DUMMY DATA INSERTED')
    }, 2000)


}
