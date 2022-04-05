import db from '../database/createConnection.js';

const insertResults = [];

await db.actors.deleteMany({});
insertResults.push(await db.actors.insertOne({id: 1, name: "Danny DeVito"}));
insertResults.push(await db.actors.insertOne({
    id: 2,
    name: "Arnold Schwarzenegger",
    movies: [
        {
            title: 'Terminator'
        },
        {
            title: 'Terminator 2'
        },
    ]
}));

console.log(insertResults);