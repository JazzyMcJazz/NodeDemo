import db from './CreateConnection.js';



db.query(`
    CREATE TABLE IF NOT EXISTS movies(
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(60)
    )
`)

db.end()





// import {db} from './CreateConnection.js';
//
// const deleteMode = true;
//
// if (deleteMode) {
//     db.exec(`DROP TABLE IF EXISTS movies;`);
// }
// db.exec(`CREATE TABLE IF NOT EXISTS movies (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title VARCHAR(255),
//     year INT
//     );`
// );
//
// if (deleteMode) {
//     db.run(`INSERT INTO movies (title, year) VALUES ('Ironman', 2008)`);
//     db.run(`INSERT INTO movies (title, year) VALUES ('Bob John Goes to Beach', 2025)`);
//     db.run(`INSERT INTO movies (title, year) VALUES ('Carnage', 2015)`);
// }

