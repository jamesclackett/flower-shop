const { sign } = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const env = process.env;

// generates a JWT for user with basic privileges for a given exp time
const generateUserJWT = async (username, expireIn) => {
    const tokenPayload = {
        "uuid": await getUserUUID(username),
        "username": username,
        "role": "user",
        "iss" : "auth-service"
    }
    const key = fs.readFileSync('./utils/keys/private_key.pem', {encoding: 'utf-8'});

    return sign(tokenPayload, key, { algorithm: 'RS256', expiresIn: expireIn });
}

// generates a JWT for user with basic privileges for a given exp time
const generateServiceJWT = async (expireIn) => {
    const tokenPayload = {
        "sub": 'auth-service',
        "role": "service",
        "iss" : "auth-service"
    }

    const key = fs.readFileSync('./utils/keys/private_key.pem', {encoding: 'utf-8'});

    return sign(tokenPayload, key, { algorithm: 'RS256', expiresIn: expireIn });

    
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