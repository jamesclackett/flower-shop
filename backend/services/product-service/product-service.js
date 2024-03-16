const queryDatabase = require('../../config/database/query-database')

const getProducts = async (req, res) => {
    console.log('product list requested');
    const result = await queryDatabase(`SELECT * FROM "product"`);
    res.send(result.rows);
}


const getProduct = async (req, res) => {
    const productId = req.params.productId;
    console.log('product list requested for', productId);
    const result = await queryDatabase(`SELECT * FROM "product" WHERE id = '${productId}'`);
    res.send(result.rows);
}


module.exports = {getProducts, getProduct};