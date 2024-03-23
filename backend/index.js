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
app.get('/product/:productUUID', productService.getProduct);

//// User API:
//app.get('/user/:userUUID', userService.getUser);
// app.get('/user/:username', userService.getUserByUsername)
app.post('/user', userService.postUser);
app.post('/user/login', userService.loginUser)
app.patch('/user/:userUUID', userService.patchUser);

//// Cart API:
app.get('/user/:userUUID/cart', cartService.getCartItems);
app.get('/user/:userUUID/cart/info', cartService.getCartInfo)
app.post('/user/:userUUID/cart/:cartUUID', cartService.postCartItem)
app.patch('/user/:userUUID/cart/:cartUUID/:itemUUID', cartService.patchCartItem)
app.delete('/user/:userUUID/cart/:cartUUID/:itemUUID', cartService.deleteCartItem)

//// Resources API:
app.get('/image/:imageName', mediaService.getImage);


app.get('/', (req, res) => res.send('You have reached the flower shop API'));
app.listen(port, () => console.log('express app running on port', port));