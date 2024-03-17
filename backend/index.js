const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

app.use(cors());
app.use(express.json())

// Services:
const mediaService = require('./services/media-service/media-service');
const userService = require('./services/user-service/user-service');
const cartService = require('./services/cart-service/cart-service');
const productService = require('./services/product-service/product-service');

// TODO - Update to using Routes instead of app.get()

//// Product API:
app.get('/products', productService.getProducts);
app.get('/product/:productId', productService.getProduct);

//// User API:
//app.get('/user/:userId', userService.getUser);
app.get('/user/:username', userService.getUserByUsername)
app.post('/user', userService.postUser);
app.patch('/user/:userId', userService.patchUser);

//// Cart API:
app.get('/user/:userId/cart', cartService.getCartItems);
app.get('/user/:userId/cart/info', cartService.getCartInfo)
app.post('/user/:userId/cart/:cartId', cartService.postCartItem)
app.patch('/user/:userId/cart/:cartId/:itemId', cartService.patchCartItem)
app.delete('/user/:userId/cart/:cartId/:itemId', cartService.deleteCartItem)

//// Resources API:
app.get('/image/:imageName', mediaService.getImage);


app.get('/', (req, res) => res.send('You have reached the flower shop API'));
app.listen(port, () => console.log('express app running on port', port));