import bcrypt from 'bcrypt';

const saltRounds = 12;
const plainTextPassword = 'asdf1234';

async function encrypt(password) {
    const hash = await bcrypt.hash(password, saltRounds);
}

encrypt(plainTextPassword);

// console.log(bcrypt);

export default {};