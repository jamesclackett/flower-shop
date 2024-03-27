const axios = require('axios');
const queryDatabase = require('../utils/database/query-database');
const { encryptPassword, validatePassword } = require('../utils/authentication/passwordAuth');
const { generateUserJWT, generateServiceJWT } = require('../utils/authorization/tokenAuth');

const env = process.env;

// Sends public key to requester
const getPublicKey = (req, res) => {
    // add encryption or verification of public key in future.
    const publicKey = env.PUBLIC_KEY;
    return res.status(200).send(publicKey);
}

// Encrypts users info and sends to user service
const registerUser = async (req, res) => {
    const userPayload = req.body.user;
    console.log("registerUser | creating user: ", userPayload.username);

    if (!userPayload || !userPayload.password) {
        console.log("registerUser | user payload missing or password missing");
        return res.status(500).json({"error": "missing user details"});
    }
    // encrypt users password before sending
    try {
        userPayload.password = await encryptPassword(userPayload.password);
    } catch (error) {
        console.log("registerUser | error creating user - password encryption failed", error);
        return res.status(500).json({"error" : "error creating user"});
    }
    try {
         // send user details to user service
        const token = await generateServiceJWT('1m');
        const axiosConfig = {
            headers: {
                'Authorization' : `${token}`
            }
        }
        const response = await axios.post(env.USER_API, {"user": userPayload}, axiosConfig);
        // send user credentials to auth table
        if (response.data.uuid) {
            storeUserCredentials(userPayload.username, userPayload.password);
            console.log("registerUser | successfully created user", response.data.uuid);
            return res.status(201).json({"successfully created user": response.data.uuid});
        } else {
            return res.status(500).json({"error": "user may not have been created"});
        }
    } catch (error) {
        console.log("registerUser | error creating user", error.message);
        return res.status(500).send(error);
    }
}

// Stores given username and password in auth table of database
const storeUserCredentials = (username, password) => {
    const sqlQuery = `INSERT INTO "auth" (username, password) VALUES ('${username}', '${password}')`;
    queryDatabase(sqlQuery);
}

// Searches for requested user and compares provided credentials with actual
const loginUser = async (req, res) => {
    const userPayload = req.body.user;
    // ensure credentials provided
    if (!userPayload.username || !userPayload.password) {
        console.log("loginUser | error - username or password not receieved");
        return res.status(401).json({"error": "missing user credentials"});
    }
    console.log('loginUser | attempting to log in user:', userPayload.username);

    // retrieve user and details via their username
    let storedPassword;
    try {
        const sqlQuery = `SELECT * FROM "auth" WHERE username = '${userPayload.username}'`
        const result = await queryDatabase(sqlQuery);
        storedPassword = result.rows[0].password;
    } catch (error) {
        return res.status(404).json({"error finding user": error});
    }

    // validate password and provide jwt auth token
    try {
        const isValid = await validatePassword(userPayload.password, storedPassword);
        if (isValid) {
            const token = await generateUserJWT(userPayload.username, '5m');
            console.log("loginUser | user verified, sending auth token.")
            return res.status(200).json({jwtToken : token}); 
        } else {
            console.log("loginUser | password validation failed for user", userPayload.username);
            return res.status(401).json({"failed": "password validation failed"});
        }
    } catch (error) {
        console.log("loginUser | password validation failed due to error", error.message);
        return res.status(500).json({"error logging in" : error.message});
    }
}

module.exports = {getPublicKey, loginUser, registerUser}
