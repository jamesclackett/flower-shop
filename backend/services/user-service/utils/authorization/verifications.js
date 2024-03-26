import { dotenv } from 'dotenv';
import { verify } from 'jsonwebtoken';
dotenv.config();

const env = process.env;

// verify token and ensure it has user privileges
export const validateUserToken = (req, res, next) => {
    console.log("validating user token");
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = verify(token, env.PUBLIC_KEY);
            req.decoded = decoded;
            validateTokenPermission(decoded, 'user') ? next() : null;
        } catch (error) {
            res.status(401).json({"error" : "unauthorized"});
        }
    }
    console.log("user token validation failed");
    return res.status(401).json({"error" : "unauthorized"});
}

// verify token and ensure it has service privileges
export const validateServiceToken = (req, res, next) => {
    // for now, always valid:
    next();
};

// check the tokens system priviledges
const validateTokenPermission = (decodedToken, privilege) => {

    if (privilege == 'user') {
        decodedToken.role === 'user' ? true : false;
    }
    if (privilege == 'admin') {
        decodedToken.role === 'admin' ? true : false;
    } 
    if (privilege == 'service') {
        decodedToken.role === 'service' ? true : false;
    } 
    else return false;
}