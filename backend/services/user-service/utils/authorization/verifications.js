const { verify } = require('jsonwebtoken');;
const fs = require('fs');

// verify token and ensure it has user privileges
const validateUserToken = (req, res, next) => {
    console.log("validateUserToken | validating user token");
    const token = req.headers.authorization;

    if (!token) {
        console.log("validateUserToken | user token validation failed - no token provided");
        return res.status(401).json({"error" : "unauthorized"});
    }
    try {
        const key = fs.readFileSync('./utils/keys/public_key.pem', {encoding: 'utf-8'});

        const decoded = verify(token, key);
        req.decoded = decoded;
        if (validateTokenPermission(decoded, 'user')) {
            console.log("validateUserToken | user token verified, permissions match")
            next();
        } else {
            console.log("validateUserToken | invalid permissions for user token");
            return res.status(401).json({"error" : "unauthorized"});
        }
    } catch (error) {
        console.log("validateUserToken | user token validation failed - token couldnt be decoded", error);
        return res.status(401).json({"error" : "unauthorized"});
    }
}

// verify token and ensure it has service privileges
const validateServiceToken = (req, res, next) => {
    console.log("validateServiceToken | validating service token");
    const token = req.headers.authorization;

    if (!token) {
        console.log("validateServiceToken | service token validation failed - no token provided");
        return res.status(401).json({"error" : "unauthorized"});
    }
    try {
        const key = fs.readFileSync('./utils/keys/public_key.pem', {encoding: 'utf-8'});

        const decoded = verify(token, key, { algorithms: ['RS256'] });
        req.decoded = decoded;
        if (validateTokenPermission(decoded, 'service')) {
            console.log("validateServiceToken | service token verified, permissions match")
            next();
        } else {
            console.log("validateServiceToken | invalid permissions for service token");
            return res.status(401).json({"error" : "unauthorized"});
        }
    } catch (error) {
        console.log("validateServiceToken | service token validation failed - token couldnt be decoded", error);
        return res.status(401).json({"error" : "unauthorized"});
    }
};

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

module.exports = { validateServiceToken, validateUserToken };