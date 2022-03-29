import bcrypt from 'bcrypt';

export const UserData = [
    {email: 'test1@asdf.com', password: await encrypt('1234'), role: 'user'},
    {email: 'test2@asdf.com', password: await encrypt('1234'), role: 'admin'},
]

export function getAllUsers() {
    return UserData.map(user => {
        const copy = {...user};
        delete copy.password
        return copy;
    });
}

export function getUserByEmail(email) {
    const user = {...UserData.find(user => user.email === email)};
    delete user.password;
    return user;
}

export async function save(user) {
    const email = user.email;
    const password = await encrypt(user.password);
    const role = 'user';
    UserData.push({email: email, password: password, role: role});
}

export function existsByEmail(email) {
    for (let i in UserData)
        if (email === UserData[i].email) return true;
    return false;
}

export async function checkCredentials(user) {
    for (let i in UserData)
        if (user.email === UserData[i].email && await bcrypt.compare(user.password, UserData[i].password))
            return true;
    return false;
}

async function encrypt(password) {
    return await bcrypt.hash(password, 12);
}
