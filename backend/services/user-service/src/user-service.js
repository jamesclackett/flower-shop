import queryDatabase from "../utils/database/query-database";

// search database for user of given username
export const getUserByUsername = async (req, res) => {
    const username = req.params.username;

    if (!username) {
        console.log("error - username not provided in url");
        return res.status(500).json({"error" : "username not provided"});
    }
    console.log("searching for user", username);
    try {
        const result = await queryDatabase(`SELECT * FROM "user" WHERE username ='${username}'`);
        if (result.rows) {
            console.log("success - user found");
            return res.status(200).send(result.rows[0]);
        }
    } catch (error) {
        console.log("error querying database for user: ", error);
        return res.status(404).send(error);
    }
}

// search database for user of given uuuid
export const getUserByUUID = async (req, res) => {
    const uuid = req.params.userUUID;

    if (!uuid) {
        console.log("error - user uuid not provided in url");
        return res.status(500).json({"error" : "uuid not provided"})
    }
    console.log("searching for user", uuid);
    try {
        const result = await queryDatabase(`SELECT * FROM "user" WHERE uuid ='${uuid}'`);
        if (result.rows) {
            console.log("success - user found");
            return res.status(200).send(result.rows[0]);
        }
    } catch (error) {
        console.log("error querying database for user: ", error);
        return res.status(404).send(error);
    }
}

// POST: creation of new users
export const postUser = async (req, res) => {
    const user = req.body.user;
    // ensure all details provided
    if (!user || !user.username || !user.password || !user.email || !user.address_list) {
        res.status(500).json({"error" : "missing user details"});
        return;
    }
    console.log("received new user creation request");
    
    // insert into database
    try {
        const addressList = JSON.stringify(user.address_list).replace(/"/g, "'");

        const sqlQuery = 
            `INSERT INTO "user" (username, email, address_list) 
            VALUES ('${user.username}', '${user.email}', ARRAY ${addressList})
            RETURNING uuid`;

        const result = await queryDatabase(sqlQuery);
        if (result.rows > 0) {
            console.log("successfully created new user", result.rows[0].uuid);
            return res.status(201).json({"uuid" : result.rows[0].uuid});
        } else {
            console.log("did not receieve uuid from database - potential creation failure")
            return res.status(500).json({"error" : "no result from database"});
        }
    } catch (error) {
        console.log("failed to create new user");
        return res.status(500).json({"error" : error});
    }
}

export const patchUser = async (req, res) => {
    const user = req.body.user;

    if (user.uuid != req.params.userUUID) {
        console.log("error - provided mismatching uuid's in body and url");
        return res.status(500).json({"error": "body and url uuid's do not match"});
    }
    console.log("received user update request");

    // update database with edited user
    try {
        const addressList = JSON.stringify(user.address_list).replace(/"/g, "'");

        const result = await queryDatabase(`UPDATE "user" SET address_list = ARRAY ${addressList} WHERE uuid = '${user.uuid}'`);

        if (result) {
            console.log("success - updated user");
            return res.status(204).json({"success": "updated user"});
        } else {
            console.log("error - database update returned nothing");
            return res.status(500).json({"error": "issue with db update response"});
        }
    } catch (error) {
        console.log("error - failed to update user", error);
        return res.status(500).send(error);
    }
}

export const deleteUser = (req, res) => {
    const uuid = req.params.uuid;
    if (!uuid) {
        console.log("error - uuid not defined");
        return res.status(500).json({"error" : "uuid not receieved"});
    }
    // delete user from database
    try {
        const result = queryDatabase(`DELETE FROM "user" WHERE uuid = '${uuid}'`);
        if (result) {
            console.log("success - deleted user");
            return res.status(204).json({"success" : "deleted user"});
        } else {
            console.log("error - database delete returned nothing");
            return res.status(500).json({"error": "issue with db delete response"});
        }
    } catch (error) {
        console.log("error - failed to delete user", error);
        return res.status(500).send(error);
    }
}

export default {getUserByUUID, getUserByUsername, postUser, patchUser, deleteUser}; 