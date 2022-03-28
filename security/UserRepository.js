import bcrypt from 'bcrypt';

export const UserData = [
    {email: 'test1@asdf.com', password: await encrypt('1234')},
    {email: 'test2@asdf.com', password: await encrypt('1234')},
]

export async function save(user) {
    const email = user.email;
    const password = await encrypt(user.password);
    UserData.push({email: email, password: password});
}

export async function compare(user) {

}

async function encrypt(password) {
    return await bcrypt.hash(password, 12);
}
