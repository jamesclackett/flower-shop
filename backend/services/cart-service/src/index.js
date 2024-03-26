import express, { json } from 'express';
import cors from 'cors';

const app = express();
const port = 8000;

app.use(cors());
app.use(json());

import * as cartService from './cart-service';
import { validateUserToken } from '../utils/authorization/verifications';

//// Cart API:
app.get('/cart/items', validateUserToken, cartService.getCartItems);
app.get('/cart/info', validateUserToken, cartService.getCartInfo);
app.post('/cart/item', validateUserToken, cartService.postCartItem);
app.patch('/cart/item/:itemUUID', validateUserToken, cartService.patchCartItem);
app.delete('/cart/item/:itemUUID', validateUserToken, cartService.deleteCartItem);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));