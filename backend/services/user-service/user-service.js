const queryDatabase = require('../../config/database/query-database')

const getUser = async (req, res) => {
    const userId = req.params.userId;
    console.log('info requested for user', userId);
    const result = await queryDatabase(`SELECT * FROM "user" WHERE id ='${userId}'`);
    res.send(result.rows);
}

const getUserByUsername = async (req, res) => {
    const username = req.params.username;
    console.log('info requested for user', username);
    const result = await queryDatabase(`SELECT * FROM "user" WHERE username ='${username}'`);
    res.send(result.rows);
}

const postUser = async (req, res) => {
    const user = req.body.user;
    const addressList = JSON.stringify(user.address_list).replace('[', '{').replace(']', '}');

    const result = await queryDatabase(`INSERT INTO "user" (username, password, email, address_list, created_at) VALUES ('${user.username}', '${user.password}', '${user.email}', '${addressList}', ${user.created_at})`)

    if (result) {
        res.status(201).send();
    } else {
        res.status(400).send();
    }
    return;
}

const patchUser = async (req, res) => {
    const user = req.body.user;

    if (user.id != req.params.userId) {
        res.status(400).send();
        return;
    }
    const addressList = JSON.stringify(user.address_list).replace('[', '{').replace(']', '}');
   
    const result = 
        await queryDatabase(`UPDATE "user" SET address_list = '${addressList}' WHERE id = ${user.id}`);

    if (result) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
    return;
}

module.exports = {getUser, getUserByUsername, postUser, patchUser}; 