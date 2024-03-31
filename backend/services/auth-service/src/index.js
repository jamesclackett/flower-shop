const express = require('express');
const cors = require('cors');
require('dotenv').config({path: '../.env'});
const { getPublicKey, loginUser, registerUser} = require('./auth-service');
const { verifyUserJWT, refreshUserJWT } = require('../utils/authorization/tokenAuth');

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json())

app.get('/auth/token/verify', verifyUserJWT);
// app.get('/auth/token/refresh', refreshUserJWT)
app.get('/auth/key', getPublicKey);
app.post('/auth/login', loginUser);
app.post('/auth/register', registerUser);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));