const { sign } = require('jsonwebtoken');
const axios = require('axios');

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
            'Authorization' : await generateServiceJWT('1m')
        }
    }
    const response = await axios.get(env.USER_API + username, axiosConfig);
    if (!response.data.uuid) throw new Error('user not found');
    return response.data.uuid;
}

module.exports = { generateServiceJWT, generateUserJWT };