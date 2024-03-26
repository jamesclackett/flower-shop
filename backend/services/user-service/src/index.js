const express = require('express');
const cors = require('cors');
const app = express();
const port = 8004;

app.use(cors());
app.use(express.json())

const userService = require('./user-service');
const { validateUserToken, validateServiceToken } = require('../utils/authorization/verifications'); 

//// User API (use by auth service):
app.post('/user', validateServiceToken, userService.postUser);
app.get('/user/:username', validateServiceToken, userService.getUserByUsername);
//// User API (use by client):
app.get('/user', validateUserToken, userService.getUserByUUID);
app.patch('/user', validateUserToken, userService.patchUser);
app.delete('/user', validateUserToken, userService.deleteUser);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));