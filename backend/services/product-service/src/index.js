import express, { json } from 'express';
const app = express();
const port = 8000;
import cors from 'cors';

app.use(cors());
app.use(json())

import {getProduct, getProducts} from './product-service';

//// Product API:
app.get('/products', getProducts);
app.get('/product/:productUUID', getProduct);


app.get('*', (req, res) => res.status(404).send());
app.listen(port, () => console.log('express app running on port', port));