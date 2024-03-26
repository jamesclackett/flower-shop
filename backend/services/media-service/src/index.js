import express, { json } from 'express';
const app = express();
const port = 8000;
import cors from 'cors';
import { getImage } from '../src/media-service';

app.use(cors());
app.use(json())


app.get('/media/image/:imageName', getImage);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));