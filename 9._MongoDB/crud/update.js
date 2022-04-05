import db from '../database/createConnection.js';

const result = await db.actors.updateOne({name: "Arnold Schwarzenegger"}, {
    $push: {movies: {title: "Twins"} }
})

console.log(result.movies);