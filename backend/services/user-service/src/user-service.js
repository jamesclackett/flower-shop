const queryDatabase = require('../utils/database/query-database');

// search database for user of given username
const getUserByUsername = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        console.log("getUserByUsername | error - username not provided in url");
        return res.status(500).json({"error" : "username not provided"});
    }
    console.log("getUserByUsername | searching for user", username);
    try {
        const result = await queryDatabase(`SELECT uuid FROM "user" WHERE username ='${username}'`);
        if (result.rowCount > 0) {
            console.log("getUserByUsername | success - user found");
            return res.status(200).send(result.rows[0]);
        } else {
            console.log("getUserByUsername | user not found");
            return res.status(404).json({"not found": "user not found"});
        } 
    } catch (error) {
        console.log("getUserByUsername | error querying database for user: ", error.message);
        return res.status(500).send(error.message);
    }
}

// search database for user of given uuuid
const getUserByUUID = async (req, res) => {
    const decodedToken = req.decoded;

    if (!decodedToken.uuid) {
        console.log("getUserByUUID | error - user uuid not provided in token");
        return res.status(500).json({"error" : "auth token missing claims"})
    }
    console.log("getUserByUUID | searching for user", decodedToken.uuid);
    try {
        const result = await queryDatabase(`SELECT * FROM "user" WHERE uuid ='${decodedToken.uuid}'`);
        if (result.rows.length > 0) {
            console.log("getUserByUUID | success - user found");
            return res.status(200).send(result.rows[0]);
        } else {
            console.log("getUserByUUID | user not found");
            return res.status(404).json({"not found" : "user not found"});
        }
    } catch (error) {
        console.log("getUserByUUID | error querying database for user: ", error.message);
        return res.status(500).send(error.message);
    }
}

// POST: creation of new users
const postUser = async (req, res) => {
    const user = req.body.user;
    // ensure all details provided
    if (!user || !user.username || !user.password || !user.email || !user.address_list) {
        res.status(500).json({"error" : "missing user details"});
        return;
    }
    console.log("postUser | received new user creation request");
    
    // insert into database
    try {
        const addressList = JSON.stringify(user.address_list).replace(/"/g, "'");

        const sqlQuery = 
            `INSERT INTO "user" (username, email, address_list) 
            VALUES ('${user.username}', '${user.email}', ARRAY ${addressList})
            RETURNING uuid`;

        const result = await queryDatabase(sqlQuery);
        if (result.rowCount > 0) {
            console.log("postUser | successfully created new user", result.rows[0].uuid);
            return res.status(201).json({"uuid" : result.rows[0].uuid});
        } else {
            console.log("postUser | did not receieve uuid from database - potential creation failure")
            return res.status(500).json({"error" : "no result from database"});
        }
    } catch (error) {
        console.log("postUser | failed to create new user", error.detail);
        return res.status(500).json({"error" : error.detail});
    }
}

const patchUser = async (req, res) => {
    const user = req.body.user;
    const decodedToken = req.decoded;

    if (!decodedToken.uuid || user.uuid != decodedToken.uuid) {
        console.log("patchUser | error - provided mismatching uuid's in body and token");
        return res.status(500).json({"error": "uuid mismatch"});
    }
    console.log("patchUser | received user update request");

    // update database with edited user
    try {
        const addressList = JSON.stringify(user.address_list).replace(/"/g, "'");

        const result = await queryDatabase(`UPDATE "user" SET address_list = ARRAY ${addressList} WHERE uuid = '${user.uuid}' RETURNING *`);

        if (result.rowCount > 0) {
            console.log("patchUser | success - updated user");
            return res.status(200).send(result.rows[0]);
        } else {
            console.log("patchUser | error - database update returned nothing");
            return res.status(500).json({"error": "issue with db update response"});
        }
    } catch (error) {
        console.log("patchUser | error - failed to update user", error);
        return res.status(500).send(error);
    }
}

const deleteUser = (req, res) => {
    const decodedToken = req.decoded;
    
    if (!decodedToken.uuid) {
        console.log("deleteUser | error - uuid not provided in auth token");
        return res.status(500).json({"error" : "auth token missing claims"});
    }
    // delete user from database
    try {
        const result = queryDatabase(`DELETE FROM "user" WHERE uuid = '${decodedToken.uuid}'`);
        if (result) {
            console.log("deleteUser | success - deleted user");
            return res.status(204).json({"success" : "deleted user"});
        } else {
            console.log("deleteUser | error - database delete returned nothing");
            return res.status(500).json({"error": "issue with db delete response"});
        }
    } catch (error) {
        console.log("deleteUser | error - failed to delete user", error);
        return res.status(500).send(error);
    }
}

module.exports =  { getUserByUUID, getUserByUsername, postUser, patchUser, deleteUser }; 