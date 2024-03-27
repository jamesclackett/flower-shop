const express = require('express');
const cors = require('cors');
require('dotenv').config({path: '../.env'});

const app = express();
const port = 8003;

app.use(cors());
app.use(express.json())

const { getProduct, getProducts } = require('./product-service');

//// Product API:
app.get('/products', getProducts);
app.get('/product/:productUUID', getProduct);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));