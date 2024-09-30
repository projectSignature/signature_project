const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const encryptPassword = async (password) => {
    console.log('enter here');
    const genSaltGenerated = await bcrypt.genSalt(SALT_ROUNDS);
    console.log('genSaltGenerated:', genSaltGenerated);
    return await bcrypt.hash(password, genSaltGenerated);
}

const verifyPassword = async (password, encrypted) => {
    console.log('Comparing passwords:', password, encrypted);
    const match = await bcrypt.compare(password, encrypted);
    console.log('Comparison result:', match);
    return match;
}

module.exports = { encryptPassword, verifyPassword };
