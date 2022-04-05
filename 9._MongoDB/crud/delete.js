import db from '../database/createConnection.js';

const result = await db.actors.deleteOne({id: 1});

console.log(result);