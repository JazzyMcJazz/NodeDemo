import {db} from '../database/Connection.js';

export async function getAllCategories() {
    return await db.all('SELECT * FROM category');
}