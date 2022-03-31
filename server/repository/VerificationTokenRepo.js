import {db} from '../database/Connection.js';

export async function getVerificationTokenByUser_id(user_id) {
    return await db.get('SELECT * FROM verification_token WHERE user_id = ?', user_id)
}

export async function checkVerificationToken(user_id, token) {
    return !!await db.get('SELECT * FROM verification_token WHERE user_id = ? AND token = ?', [user_id, token]);
}

export async function saveNewVerificationToken(user_id, token) {
        await db.run('INSERT INTO verification_token (user_id, token) VALUES (?, ?)', [user_id, token]);
}

export async function removeVerificationTokenByUser_id(user_id) {
    await db.run('DELETE FROM verification_token WHERE user_id = ?', user_id)
}