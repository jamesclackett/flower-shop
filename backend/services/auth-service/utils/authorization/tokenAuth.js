import { dotenv } from "dotenv";
import { sign } from "jsonwebtoken";
import { axios } from "axios";
dotenv.config();

const env = process.env;

// generates a JWT for user with basic privileges for a given exp time
export const generateJWT = async (username, expireIn) => {
    const tokenPayload = {
        "sub": await getUserUUID(username),
        "username": username,
        "role": "user",
        "iss" : "auth-service"
    }
    return sign(tokenPayload, env.PRIVATE_KEY, {expiresIn: expireIn});
}

const getUserUUID = async (username) => {
    const test = await axios.get(env.USER_API + username);
    if (!test) throw new Error('user not found');
    return test;
}

// FOR USE IN OTHER SERVICES, SAVE FOR LATER
// export const validateToken = (token) => {
//     console.log("checking token..");

//     if (!token) {
//         console.log('no token provided');
//         return res.status(401).json({error: "unauthorized"});
//     }
//     try {
//         verified = verify(token, env.PUBLIC_KEY);
//         console.log('token validated!')
//         return verified;
//     } catch (error) {
//         console.log('token not validated');
//         return error;
//     }
// }