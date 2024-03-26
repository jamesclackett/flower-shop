import { dotenv } from "dotenv";
import { axios } from "axios";
import queryDatabase from "../utils/database/query-database";
import { encryptPassword, validatePassword } from "../utils/authentication/passwordAuth";
import { generateUserJWT, generateServiceJWT } from "../utils/authorization/tokenAuth";
dotenv.config();

const env = process.env;

// Sends public key to requester
export const getPublicKey = (req, res) => {
    // add encryption or verification of public key in future.
    const publicKey = env.PUBLIC_KEY;
    return res.status(200).send(publicKey);
}

// Encrypts users info and sends to user service
export const registerUser = async (req, res) => {
    const userPayload = req.body.user;
    console.log("creating user: ", userPayload.username);

    if (!userPayload || !userPayload.password) {
        console.log("user payload missing or password missing");
        return res.status(500).json({"error": "missing user details"});
    }
    // encrypt users password before sending
    try {
        userPayload.password = await encryptPassword(userPayload.password);
    } catch (error) {
        console.log("error creating user - password encryption failed", error);
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
        const result = await axios.post(env.USER_API, {"user": userPayload}, axiosConfig);
        // send user credentials to auth table
        if (result) storeUserCredentials(userPayload.username, userPayload.password);
        return res.status(201).json({"successfully created user": result});
    } catch (error) {
        console.log("error creating user", error);
        return res.status(500).json({"error": error});
    }
}

// Stores given username and password in auth table of database
const storeUserCredentials = (username, password) => {
    const sqlQuery = `INSERT INTO "auth" (username, password) VALUES ('${username}', '${password}')`;
    queryDatabase(sqlQuery);
}

// Searches for requested user and compares provided credentials with actual
export const loginUser = async (req, res) => {
    const userPayload = req.body.user;
    // ensure credentials provided
    if (!userPayload.username || !userPayload.password) {
        console.log("error - username or password not receieved");
        return res.status(401).json({"error": "missing user credentials"});
    }
    console.log('attempting to log in user:', userPayload.username);

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
            return res.status(200).json({jwtToken : token}); 
        } else {
            console.log("password validation failed for user", userPayload.username);
            return res.status(401).json({"failed": "password validation failed"});
        }
    } catch (error) {
        console.log("password validation failed due to error");
        return res.status(500).json({"error logging in" : error});
    }
}
