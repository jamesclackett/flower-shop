const queryDatabase = require('../../config/database/query-database')

const getProducts = async (req, res) => {
    console.log('product list requested');
    const result = await queryDatabase(`SELECT * FROM "product"`);
    res.send(result.rows);
}


const getProduct = async (req, res) => {
    const productUUID = req.params.productUUID;
    console.log(`product ${productUUID} requested`);
    const result = await queryDatabase(`SELECT * FROM "product" WHERE uuid = '${productUUID}'`);
    res.send(result.rows[0]);
}


module.exports = {getProducts, getProduct};