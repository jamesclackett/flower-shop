const queryDatabase = require('../utils/database/query-database');


// get all products
const getProducts = async (req, res) => {
    console.log('product list requested');
    try {
        const result = await queryDatabase(`SELECT * FROM "product"`);
        return res.status(200).send(result.rows);
    } catch (error) {
        console.log("error getting products");
        return res.status(500).send(error);
    }
    
}

// get product by productUUID
const getProduct = async (req, res) => {
    const productUUID = req.params.productUUID;
    console.log(`product ${productUUID} requested`);
    try {
        const result = await queryDatabase(`SELECT * FROM "product" WHERE uuid = '${productUUID}'`);
        return res.status(200).send(result.rows[0]);
    } catch (error) {
        console.log("error getting product");
        return res.status(500).send(error);
    }
}

module.exports = { getProduct, getProducts };