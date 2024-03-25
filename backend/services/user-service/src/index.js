import express, { json } from 'express';
const app = express();
const port = 8000;
import cors from 'cors';

app.use(cors());
app.use(json())

import * as userService from './user-service';
import { validateUserToken, validateServiceToken } from '../utils/authorization/verifications' 

//// User API:
app.post('/user', validateServiceToken, userService.postUser)
app.get('/user/:username', validateServiceToken, userService.getUserByUsername)
app.get('/user/:userUUID', validateUserToken, userService.getUserByUUID)
app.patch('/user/:userUUID', validateUserToken, userService.patchUser);
app.delete('/user/:userUUID', validateUserToken, userService.deleteUser);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));