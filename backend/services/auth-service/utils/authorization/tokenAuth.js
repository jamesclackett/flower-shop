const { sign, verify } = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const env = process.env;

// generates a JWT for user with basic privileges for a given exp time
const generateUserJWT = async (username, expiresIn) => {
    const tokenPayload = {
        "uuid": await getUserUUID(username),
        "username": username,
        "role": "user",
        "iss" : "auth-service"
    }
    const key = fs.readFileSync('./utils/keys/private_key.pem', {encoding: 'utf-8'});

    return sign(tokenPayload, key, { algorithm: 'RS256', expiresIn: expiresIn});
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

const verifyUserJWT = (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        console.log("verifyUserJWT | JWT verification failed - no token provided");
        return res.status(401).json({"error" : "unauthorized"});
    }
    
    try {
        const key = fs.readFileSync('./utils/keys/public_key.pem', {encoding: 'utf-8'});
        verify(token, key);
        return res.status(200).json({"isValid": true});
    } catch (error) {
        console.log("verifyUserJWT | user jwt verification failed due to error", error.message);
        return res.status(401).send(error.message);
    }
}

// const refreshUserJWT = async (req, res) => {
//     const refreshToken = req.headers.authorization;;

//     if (!refreshToken) {
//         console.log("refreshUserJWT | no token provided");
//         return res.status(401).json({"failed to refresh": "no refresh token provided"});
//     }
//     try {
//         const pubKey = fs.readFileSync('./utils/keys/public_key.pem', {encoding: 'utf-8'});
//         const decoded = await verify(refreshToken, pubKey);

//         const newUserToken = await generateUserJWT(decoded.username, '30s');
//         console.log("refreshUserJWT | token successfully refreshed")
//         return res.status(200).json({"jwtToken" : newUserToken});
//     } catch (error) {
//         console.log("refreshUserJWT | error: couldnt verify token", error.message);
//         return res.status(401).json({"error": "failed to refresh token"});
//     }
// }

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

module.exports = { generateServiceJWT, generateUserJWT, verifyUserJWT};