import { dotenv } from 'dotenv';
import { verify } from 'jsonwebtoken';
dotenv.config();

const env = process.env;

export const validateUserToken = (req, res, next) => {
    console.log("validating user token");
    const token = req.headers.authorization;
    if (token) {
        const decoded = verify(token, env.PUBLIC_KEY);
        validateTokenPermission(decoded, 'user') ? next() : null;
    }
    console.log("user token validation failed");
    return res.status(401).json({"error" : "unauthorized"});
}

export const validateServiceToken = (req, res, next) => {
    console.log("validating service token");
    const token = req.headers.authorization;
    if (token) {
        const decoded = verify(token, env.PUBLIC_KEY);
        validateTokenPermission(decoded, 'service') ? next() : null;
    }
    console.log("service token validation failed");
    return res.status(401).json({"error" : "unauthorized"});
};

const validateTokenPermission = (decodedToken, privilege) => {

    if (privilege == 'user') {
        decoded.role === 'user' ? true : false;
    }
    if (privilege == 'admin') {
        decoded.role === 'admin' ? true : false;
    } 
    if (privilege == 'service') {
        decoded.role === 'service' ? true : false;
    } 
    else return false;
}