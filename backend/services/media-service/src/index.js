const express = require('express');
const cors = require('cors');
const { getImage } = require('../src/media-service');

const app = express();
const port = 8002;

app.use(cors());
app.use(express.json())


app.get('/media/image/:imageName', getImage);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));