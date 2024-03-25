import express, { json } from 'express';
import cors from 'cors';
import { getPublicKey, loginUser, registerUser } from './auth-service';

const app = express();
const port = 8000;

app.use(cors());
app.use(json())


app.get('/auth/key', getPublicKey);
app.post('/auth/login', loginUser);
app.post('/auth/register', registerUser);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));