const { verify } = require('jsonwebtoken');

const env = process.env;

// verify token and ensure it has user privileges
const validateUserToken = (req, res, next) => {
    console.log("validating user token");
    const token = req.headers.authorization;

    if (!token) {
        console.log("user token validation failed - no token provided");
        return res.status(401).json({"error" : "unauthorized"});
    }
    try {
        const decoded = verify(token, env.PRIVATE_KEY);
        req.decoded = decoded;
        if (validateTokenPermission(decoded, 'user')) {
            console.log("user token verified, permissions match")
            next();
        } else {
            console.log("invalid permissions for user token");
            return res.status(401).json({"error" : "unauthorized"});
        }
    } catch (error) {
        console.log("user token validation failed - token couldnt be decoded", error.message);
        return res.status(401).json({"error" : "unauthorized"});
    }
}

// check the tokens system priviledges
const validateTokenPermission = (decodedToken, privilege) => {

    if (privilege == 'user') {
        return decodedToken.role === 'user' ? true : false;
    }
    if (privilege == 'admin') {
        return decodedToken.role === 'admin' ? true : false;
    } 
    if (privilege == 'service') {
        return decodedToken.role === 'service' ? true : false;
    } 
    else return false;
}

module.exports = { validateUserToken }