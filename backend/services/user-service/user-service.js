const queryDatabase = require('../../config/database/query-database');
const { encryptPassword, validatePassword } = require('./auth-service');

const loginUser = async (req, res) => {
    const userPayload = req.body.user;
    console.log('info requested for user', userPayload.username);

    const user = await getUserByUsername(userPayload.username);

    if (!user) {
        res.status(404).send();
        return;
    }

    const isValid = await validatePassword(userPayload.password, user.password);

    if (isValid){
        res.status(200).send(user);
        return;
    } else {
        res.status(401).send();
        return;
    }
}

const getUserByUsername = async (username) => {
    console.log(`info requested for user '${username}'`);
    const result = await queryDatabase(`SELECT * FROM "user" WHERE username ='${username}'`);
    return result.rows[0];
}

const postUser = async (req, res) => {
    const user = req.body.user;

    if (!user) {
        res.status(500).send();
        return;
    }

    const addressList = JSON.stringify(user.address_list).replace(/"/g, "'");

    const hashedPassword = await encryptPassword(user.password)
    
    if (!hashedPassword || hashedPassword == user.password) {
        res.status(500).send();
        return;
    }

    const result = await queryDatabase(`INSERT INTO "user" (username, password, email, address_list) VALUES ('${user.username}', '${hashedPassword}', '${user.email}', ARRAY ${addressList})`)

    if (result) {
        res.status(201).send();
        return;
    } else {
        console.log("error creating user");
        res.status(500).send();
        return;
    }
    
}

const patchUser = async (req, res) => {
    const user = req.body.user;

    if (user.uuid != req.params.userUUID) {
        res.status(400).send();
        return;
    }
    const addressList = JSON.stringify(user.address_list).replace(/"/g, "'");

    const result = 
        await queryDatabase(`UPDATE "user" SET address_list = ARRAY ${addressList} WHERE uuid = '${user.uuid}'`);

    if (result) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
    return;
}

module.exports = {loginUser, postUser, patchUser}; 