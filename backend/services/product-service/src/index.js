const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

app.use(cors());
app.use(express.json())

const productService = require('./product-service');

//// Product API:
app.get('/products', productService.getProducts);
app.get('/product/:productUUID', productService.getProduct);
app.patch('/product/:productUUID', productService.updateProduct);
app.delete('/product/:productUUID', productService.deleteProduct);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));