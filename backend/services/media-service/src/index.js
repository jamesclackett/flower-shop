const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');
const mediaService = require('./media-service');

app.use(cors());
app.use(express.json())


app.get('/media/image/:imageName', mediaService.getImage);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));