const { genSalt, hash, compare } = require("bcrypt");

const encryptPassword = async (password) => {
    const salt = await genSalt();
    return await hash(password, salt);
}

const validatePassword = async (password, storedPassword) => {
    return await compare(password, storedPassword);
}

module.exports = { encryptPassword, validatePassword };