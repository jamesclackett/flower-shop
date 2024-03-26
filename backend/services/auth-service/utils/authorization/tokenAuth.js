const { sign } = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const env = process.env;

// generates a JWT for user with basic privileges for a given exp time
const generateUserJWT = async (username, expireIn) => {
    const tokenPayload = {
        "uuid": await getUserUUID(username),
        "username": username,
        "role": "user",
        "iss" : "auth-service"
    }
    return sign(tokenPayload, env.PRIVATE_KEY, {expiresIn: expireIn});
}

// generates a JWT for user with basic privileges for a given exp time
const generateServiceJWT = async (expireIn) => {
    const tokenPayload = {
        "sub": 'auth-service',
        "role": "service",
        "iss" : "auth-service"
    }
    return sign(tokenPayload, env.PRIVATE_KEY, {expiresIn: expireIn});
}

const getUserUUID = async (username) => {
    const axiosConfig = {
        headers: {
            'Authorization' : generateServiceJWT('1m')
        }
    }
    const test = await axios.get(env.USER_API + username, axiosConfig);
    if (!test) throw new Error('user not found');
    return test;
}

module.exports = { generateServiceJWT, generateUserJWT };