const queryDatabase = require('../utils/database/query-database');

// Get a list of the user's cart items. If no cart exists, create one.
const getCartItems = async (req, res) => {
    const decodedToken = req.decoded;

    if (!decodedToken.uuid){
        return res.status(500).json({error: "auth token missing claims"});
    }
    // search for cart in database
    try {
        const cartUUID = await getCartUUID(decodedToken.uuid);
        // if cart doesnt exist, create one.
        if (!cartUUID) {
            console.log("user doesnt seem to have a cart, creating one..");
            const createdCart = await createCart(decodedToken.uuid);
            if (!createdCart) {
                return res.status(500).json({"error" : "failed to create cart for user"});
            } 
        }

        const sqlQuery = `
        SELECT cart_item.*, p.product_name, p.description, p.price, p.stock_remaining, p.img_src
        FROM cart_item
        INNER JOIN product as p ON cart_item.product_uuid = p.uuid
        WHERE cart_item.cart_uuid = '${cartUUID}'`;

        const result = await queryDatabase(sqlQuery);
        return res.status(200).send(result.rows);

    } catch (error) {
        return res.status(500).send(error);
    }
}

// Search for users' cart information in datatabase
const getCartInfo = async (req, res) => {
    const decodedToken = req.decoded;

    if (!decodedToken.uuid) {
        return res.status(500).json({"error" : "auth token missing claims"});
    } 
    // search for cart using users uuid
    try {
        const cartInfo = { uuid: await getCartUUID(decodedToken.uuid) };
        if (!cartInfo) {
            return res.status(404).json({"not found" : "cart no found"});
        } else {
            res.status(200).send(cartInfo);
        }
    } catch (error) {
        return res.status(500).send(error);
    }

}

// retrive cart with user uuid
const getCartUUID = async (userUUID) => {
    if (!userUUID) {
        throw new Error("user uuid not provided. cannot search database");
    }
    console.log('cart requested for user', userUUID);
    const result = await queryDatabase(`SELECT * FROM "cart" WHERE user_uuid = '${userUUID}'`);
    if (result.rowCount > 0) {
        return result.rows[0].uuid;
    }
}

// delete a user's cart
const deleteCartItem = async (req, res) => {
    const decodedToken = req.decoded;
    const itemUUID = req.params.itemUUID;

    if (!decodedToken.uuid) {
        return res.status(500).json({"error" : "auth token missing claims"});
    } 
    if (!itemUUID){
        return res.status(500).json({"error" : "no item uuid provided"});
    }
    try {
        // find cart item in database, compare cart_uuids for validity
        const cartUUID = await getCartUUID(decodedToken.uuid);
        const searchQuery = `SELECT * FROM "cart_item" WHERE uuid = '${itemUUID}'`;
        const searchRes = await queryDatabase(searchQuery);
       
        if (searchRes.rowCount > 0) {
            if (searchRes.rows[0].cart_uuid != cartUUID){
                return res.status(401).json({"failed" : "not authorized"});
            }
        }

        const sqlQuery = `DELETE FROM "cart_item" WHERE uuid = '${itemUUID}'`;
        const result = await queryDatabase(sqlQuery);

        if (result.rowCount > 0) {
            res.status(200).json({"success" : "cart item deleted"});
        } else {
            res.status(404).json({"failed" : "no cart items deleted"});
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

// Creates a new cart for the user in the database
const createCart = async (userUUID) => {
    return await queryDatabase(`INSERT INTO "cart" (user_uuid) VALUES ('${userUUID}')`);
}

// adds a new cart item to the user's cart.
const postCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;
    const decodedToken = req.decoded;

    if (!cartItem) {
        return res.status(500).json({"error" : "cart item is missing from request"});
    }
    if (!decodedToken.uuid) {
        return res.status(500).json({"error" : "auth token missing claims"});
    } 

    try {
        const cartUUID = await getCartUUID(decodedToken.uuid);
        if (cartUUID != cartItem.cart_uuid) {
            return res.status(401).json({"failed" : "not authorized"});
        }

        const sqlQuery = `INSERT INTO "cart_item" (cart_uuid, product_uuid, quantity) VALUES ('${cartItem.cart_uuid}', '${cartItem.product_uuid}', ${cartItem.quantity })`;

        const result = await queryDatabase(sqlQuery);
        if (result.rowCount > 0) {
            return res.status(201).json({"success" : "cart item created"});
        } else {
            return res.status(404).json({"failed" : "cart item was not created"});
        }
    } catch (error) {
        return res.status(500).send(error);
    }
}

// updates a cart item (increased quantity, decreased quantity)
const patchCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;
    const decodedToken = req.decoded;

    if (!cartItem || cartItem.uuid != req.params.itemUUID) {
        res.status(500).json({"error" : "uuid mismatch"});
        return;
    }
    if (!decodedToken.uuid) {
        return res.status(500).json({"error" : "auth token missing claims"});
    } 
    try {
        // ensure that only the cart for token user can be updated 
        const cartUUID = await getCartUUID(decodedToken.uuid);
        if (cartUUID != cartItem.cartUUID) {
            return res.status(401).json({"failed" : "not authorized"});
        }
        const sqlQuery = `UPDATE "cart_item" SET quantity = ${cartItem.quantity} WHERE uuid = '${cartItem.uuid}'`;
        const result = await queryDatabase(sqlQuery);
        if (result.rowCount > 0) {
            return res.status(200).json({"success" : ""});
        } else {
            return res.status(404).json({"failed" : "no cart items updated"});
        }  
    } catch (error) {
        return res.status(500).send(error);
    }

}

module.exports = {
    getCartItems,
    getCartInfo,
    deleteCartItem,
    postCartItem,
    patchCartItem
};

