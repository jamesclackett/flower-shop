const queryDatabase = require('../utils/database/query-database');

// Get a list of the user's cart items. If no cart exists, create one.
const getCartItems = async (req, res) => {
    const decodedToken = req.decoded;

    if (!decodedToken.uuid){
        console.log("getCartItems | auth token is missing uuid");
        return res.status(500).json({error: "auth token missing claims"});
    }
    // search for cart in database
    try {
        let cartUUID = await getCartUUID(decodedToken.uuid);
        // if cart doesnt exist, create one.
        if (!cartUUID) {
            console.log("getCartItems | user doesnt seem to have a cart, creating one..");
            const createdCart = await createCart(decodedToken.uuid);
            if (!createdCart) {
                console.log("getCartItems | failed to create cart");
                return res.status(500).json({"error" : "failed to create cart for user"});
            }
            cartUUID = createdCart.uuid;
        }

        const sqlQuery = `
        SELECT cart_item.*, p.product_name, p.description, p.price, p.stock_remaining, p.img_src
        FROM cart_item
        INNER JOIN product as p ON cart_item.product_uuid = p.uuid
        WHERE cart_item.cart_uuid = '${cartUUID}'`;

        const result = await queryDatabase(sqlQuery);
        if (result.rowCount > 0) {
            console.log("getCartItems | retrieved cart items from database");
        } else {
            console.log("getCartItems | database query retrieved 0 cart items");
        }
        return res.status(200).send(result.rows);

    } catch (error) {
        console.log("getCartItems | failed to get cart items due to error", error.message);
        return res.status(500).send(error.message);
    }
}

// Search for users' cart information in datatabase
const getCartInfo = async (req, res) => {
   
    const decodedToken = req.decoded;

    if (!decodedToken.uuid) {
        console.log("getCartInfo | auth token missing uuid");
        return res.status(500).json({"error" : "auth token missing claims"});
    } 
    // search for cart using users uuid
    try {
        const cartUUID = await getCartUUID(decodedToken.uuid);
        if (!cartUUID) {
            console.log("getCartInfo | couldnt find cart info");
            return res.status(404).json({"not found" : "cart info not found"});
        } else {
            console.log("getCartInfo | found cart info, sending.");
            return res.status(200).send({uuid: cartUUID});
        }
    } catch (error) {
        console.log("getCartInfo | error finding cart info", error.message);
        return res.status(500).send(error.message);
    }

}

// retrive cart with user uuid
const getCartUUID = async (userUUID) => {
    if (!userUUID) {
        throw new Error("user uuid not provided. cannot search database");
    }
    console.log('getCartUUID | cart uuid requested for user', userUUID);
    const result = await queryDatabase(`SELECT * FROM "cart" WHERE user_uuid = '${userUUID}'`);
    if (result.rowCount > 0) {
        console.log('getCartUUID | cart uuid found for user', userUUID);
        return result.rows[0].uuid;
    }
}

// delete a user's cart
const deleteCartItem = async (req, res) => {
    const decodedToken = req.decoded;
    const itemUUID = req.params.itemUUID;

    if (!decodedToken.uuid) {
        console.log("deleteCartItem | auth token is missing uuid");
        return res.status(500).json({"error" : "auth token missing claims"});
    } 
    if (!itemUUID){
        console.log("deleteCartItem | url is missing item uuid");
        return res.status(500).json({"error" : "no item uuid provided"});
    }
    try {
        // find cart item in database, compare cart_uuids for validity
        const cartUUID = await getCartUUID(decodedToken.uuid);
        const searchQuery = `SELECT * FROM "cart_item" WHERE uuid = '${itemUUID}'`;
        const searchRes = await queryDatabase(searchQuery);
       
        if (searchRes.rowCount > 0) {
            if (searchRes.rows[0].cart_uuid != cartUUID){
                console.log("deleteCartItem | not authorized to delete this");
                return res.status(401).json({"failed" : "not authorized"});
            }
        }

        const sqlQuery = `DELETE FROM "cart_item" WHERE uuid = '${itemUUID}'`;
        const result = await queryDatabase(sqlQuery);

        if (result.rowCount > 0) {
            console.log("deleteCartItem | successfully deleted item");
            return res.status(204).send();
        } else {
            console.log("deleteCartItem | no cart items to delete");
            return res.status(404).json({"failed" : "no cart items deleted"});
        }
    } catch (error) {
        console.log("deleteCartItem | error while deleting cart item", error.message);
        return res.status(500).send(error.message);
    }
}

// Creates a new cart for the user in the database
const createCart = async (userUUID) => {
    const response = await queryDatabase(`INSERT INTO "cart" (user_uuid) VALUES ('${userUUID}') RETURNING *`);
    return response.rows[0];
}

// adds a new cart item to the user's cart.
const postCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;
    const decodedToken = req.decoded;

    if (!cartItem) {
        console.log("postCartItem | cart item was not provided in body");
        return res.status(500).json({"error" : "cart item is missing from request"});
    }
    if (!decodedToken.uuid) {
        console.log("postCartItem | auth token is missing uuid");
        return res.status(500).json({"error" : "auth token missing claims"});
    } 

    try {
        const cartUUID = await getCartUUID(decodedToken.uuid);
        if (cartUUID != cartItem.cart_uuid) {
            console.log("postCartItem | not authorized to post this item, uuid mismatch");
            return res.status(401).json({"failed" : "not authorized"});
        }

        const sqlQuery = `INSERT INTO "cart_item" (cart_uuid, product_uuid, quantity) VALUES ('${cartItem.cart_uuid}', '${cartItem.product_uuid}', ${cartItem.quantity })`;

        const result = await queryDatabase(sqlQuery);
        if (result.rowCount > 0) {
            console.log("postCartItem | successfully created cart item");
            return res.status(204).send();
        } else {
            console.log("postCartItem | cart item was not created");
            return res.status(404).json({"failed" : "cart item was not created"});
        }
    } catch (error) {
        console.log("postCartItem | failed to create cart item due to error", error.message);
        return res.status(500).send(error.message);
    }
}

// updates a cart item (increased quantity, decreased quantity)
const patchCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;
    const decodedToken = req.decoded;

    if (!cartItem || cartItem.uuid != req.params.itemUUID) {
        console.log("patchCartItem | cart item body and params mismatch");
        return res.status(500).json({"error" : "uuid mismatch"});
    }
    if (!decodedToken.uuid) {
        console.log("patchCartItem | auth token is missing uuid");
        return res.status(500).json({"error" : "auth token missing claims"});
    } 
    try {
        // ensure that only the cart for token user can be updated 
        const cartUUID = await getCartUUID(decodedToken.uuid);
        console.log(cartUUID, cartItem.cart_uuid);
        if (cartUUID != cartItem.cart_uuid) {
            console.log("patchCartItem | not authorized to update this cart");
            return res.status(401).json({"failed" : "not authorized"});
        }
        const sqlQuery = `UPDATE "cart_item" SET quantity = ${cartItem.quantity} WHERE uuid = '${cartItem.uuid}'`;
        const result = await queryDatabase(sqlQuery);
        if (result.rowCount > 0) {
            console.log("patchCartItem | successfully updated cart items");
            return res.status(204).send();
        } else {
            console.log("patchCartItem | no cart items were updated");
            return res.status(404).json({"failed" : "no cart items updated"});
        }  
    } catch (error) {
        console.log("patchCartItem | error when updating cart item", error.message);
        return res.status(500).send(error.message);
    }

}

module.exports = {
    getCartItems,
    getCartInfo,
    deleteCartItem,
    postCartItem,
    patchCartItem
};

