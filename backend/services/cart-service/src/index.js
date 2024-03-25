const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

app.use(cors());
app.use(express.json())

const cartService = require('./cart-service');

//// Cart API:
app.post('/cart/:userUUID', cartService.postCart)
app.get('/cart/:userUUID/items', cartService.getCartItems);
app.get('/cart/:userUUID/info', cartService.getCartInfo)
app.post('/cart/:userUUID/item/:cartUUID', cartService.postCartItem)
app.patch('/cart/:cartUUID/item/:itemUUID', cartService.patchCartItem)
app.delete('/cart/:cartUUID/item/:itemUUID', cartService.deleteCartItem)


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));