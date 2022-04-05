import db from '../database/createConnection.js'

const all = await db.actors.find().toArray();

const brokeArnold = await db.actors.find({id: 2}).toArray();

console.log(brokeArnold[0].movies);