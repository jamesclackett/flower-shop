const queryDatabase = require('../../config/database/query-database')


const getCartItems = async (req, res) => {
    const userUUID = req.params.userUUID;

    if (userUUID != req.decodedToken.uuid){
        return res.status(401).json({error: "unauthorized"});
    }

    const cartUUID = await getCartByUserUUID(userUUID);

    if (!cartUUID) {
        console.log("user doesnt seem to have a cart.");
        console.log("creating cart for user", userUUID);
        const createdCart = await postCart(userUUID);
        if (createdCart) {
            return res.status(200).send();
        } else {
            return res.status(400).send();
        }
    }

    const result = await queryDatabase(`
    SELECT cart_item.*, p.product_name, p.description, p.price, p.stock_remaining, p.img_src
    FROM cart_item
    INNER JOIN product as p ON cart_item.product_uuid = p.uuid
    WHERE cart_item.cart_uuid = '${cartUUID}';`);
    if (result) {
        return res.send(result.rows)
    }
}

const getCartInfo = async (req, res) => {
    const userUUID = req.params.userUUID;

    if (!userUUID) {
        res.status(400).send();
        return;
    } 

    const cartInfo = {
        uuid: await getCartByUserUUID(userUUID)
    }
    
    if (!cartInfo) {
        res.status(400).send();
        return;
    } else {
        res.status(200).send(cartInfo);
    }

}

const getCartByUserUUID = async (userUUID) => {
    if (!userUUID) {
        return;
    }
    console.log('cart requested for user', userUUID);
    const result = await queryDatabase(`SELECT * FROM "cart" WHERE user_uuid = '${userUUID}'`);
    if (result.rows.length > 0) {
        return result.rows[0].uuid;
    }
}

const deleteCartItem = async (req, res) => {
    const itemUUID = req.params.itemUUID;
    if (!itemUUID) {
        res.status(400).send();
        return;
    }
    const result = await queryDatabase(`DELETE FROM "cart_item" WHERE uuid = '${itemUUID}'`);

    if (result) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
    return;
}

const postCart = async (userUUID) => {
    if (userUUID) {
        return await queryDatabase(`INSERT INTO "cart" (user_uuid) VALUES ('${userUUID}')`)
    }
    return
}

const postCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;

    if (!cartItem) {
        res.status(400).send();
        return;
    }

    const result = await queryDatabase(`INSERT INTO "cart_item" (cart_uuid, product_uuid, quantity) VALUES ('${cartItem.cart_uuid}', '${cartItem.product_uuid}', ${cartItem.quantity })`)

    if (result) {
        res.status(201).send();
    } else {
        res.status(400).send();
    }
    return;
    
}

const patchCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;

    if (!cartItem || cartItem.uuid != req.params.itemUUID) {
        res.status(400).send();
        return;
    }

    const result = 
        await queryDatabase(`UPDATE "cart_item" SET quantity = ${cartItem.quantity} WHERE uuid = '${cartItem.uuid}'`);

    if (result) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
    return;
}



module.exports = {getCartItems, getCartInfo, postCart, postCartItem, patchCartItem, deleteCartItem};