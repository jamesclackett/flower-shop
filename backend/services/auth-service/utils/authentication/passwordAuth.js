import { genSalt, hash, compare } from "bcrypt";

export const encryptPassword = async (password) => {
    const salt = await genSalt();
    return await hash(password, salt);
}

export const validatePassword = async (password, storedPassword) => {
    return await compare(password, storedPassword);
}