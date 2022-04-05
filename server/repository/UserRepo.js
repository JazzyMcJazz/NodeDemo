import bcrypt from 'bcrypt';
import {db} from "../database/Connection.js";

async function getAllUsers() {
    const users = await db.all('SELECT * FROM user');
    users.forEach(user => delete user.password); // alternatively don't SELECT all,
    return users;
}



async function getUserById(id) {
    const user = await db.get('SELECT * FROM user WHERE id = ?', id);
    if (user !== undefined) delete user.password;
    return user;
}

async function getUserByEmail(email) {
    const user = await db.get('SELECT * FROM user WHERE email = ?', [email])
    if (user !== undefined) delete user.password;
    return user;
}

async function saveNewUser(user) {
    if (user.password) user.password = await encrypt(user.password); // encrypt password

    const keys = Object.keys(user);
    const values = Object.values(user);

    // prepare the '?'s for dynamic number of columns in the prepared statement
    let psv = '';
    keys.forEach(() => psv += '?, ');
    psv = psv.slice(0, psv.length-2)

    const sql = `INSERT INTO user (${keys}) VALUES (${psv})`;
    const stmt = await db.prepare(sql)
    await stmt.bind(values);

    try {
        const result = await stmt.run();
        return result.lastID;

    } catch (err) {
        return { err: { errno: err.errno, message: err.message } }
    }
}

async function updateUser(user) {
    if (user.password) user.password = encrypt(user.password); // encrypt password

    // move id to bottom of object.
    // This is important when binding values to the prepared statement
    const id = user.id;
    delete user.id;
    user.id = id;

    const keys = Object.keys(user);
    const values = Object.values(user);

    if (!keys.includes('id'))
        return { err: {errno: 0, message: `Can't update user. No ID provided`}}

    let preparedValues = '';
    for (let i in keys)
        if (keys[i] !== 'id') preparedValues += keys[i] + ' = ?, '
    preparedValues = preparedValues.slice(0, preparedValues.length-2);

    const sql = `UPDATE user SET ${preparedValues} WHERE id = ?`
    const stmt = await db.prepare(sql)
    await stmt.bind(values);

    try {
        const result = await stmt.run();
        return result.lastID;

    } catch (err) {
        return { err: { errno: err.errno, message: err.message } }
    }

}

async function userExistsByEmail(email) {
    const user = await db.get('SELECT email FROM user WHERE email = ?', [email])
    return user !== undefined
}

async function checkUserCredentialsAndReturnUser(user) {
    const userFromDb = await db.get('SELECT email, password, enabled FROM user WHERE email = ?', [user.email])
    if (userFromDb)
        if (await bcrypt.compare(user.password, userFromDb.password) && userFromDb.enabled) {
            delete userFromDb.password;
            return userFromDb;
        }
    return false
}

// oneliner, but this way the number of salt rounds is constant without using a const
async function encrypt(password) {
    return await bcrypt.hash(password, 12);
}

export {
    getAllUsers, getUserById, getUserByEmail, saveNewUser,
    updateUser, userExistsByEmail, checkUserCredentialsAndReturnUser
}