const express = require('express');
const cors = require('cors');
require('dotenv').config({path: '../.env'});

const app = express();
const port = 8001;

app.use(cors());
app.use(express.json());

const cartService = require('./cart-service');
const { validateUserToken } = require('../utils/authorization/verifications');

//// Cart API:
app.get('/cart/items', validateUserToken, cartService.getCartItems);
app.get('/cart/info', validateUserToken, cartService.getCartInfo);
app.post('/cart/item', validateUserToken, cartService.postCartItem);
app.patch('/cart/item/:itemUUID', validateUserToken, cartService.patchCartItem);
app.delete('/cart/item/:itemUUID', validateUserToken, cartService.deleteCartItem);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));