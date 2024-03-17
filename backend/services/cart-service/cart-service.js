const queryDatabase = require('../../config/database/query-database')

// TODO: Change this to use an SQL join instead.

// app.get('/user/:userId/cart', cartService.getCartItems);
// app.post('/user/:userId/cart/:cartId', cartService.postCartItem)
// app.patch('/user/:userId/cart/:cartId', cartService.patchCartItem)

const getCartItems = async (req, res) => {
    const cartId = await getCartByUserId(req.params.userId);

    if (!cartId) {
        res.status(400).send();
        return;
    }

    const result = await queryDatabase(`
    SELECT cart_item.*, p.product_name, p.description, p.price, p.stock_remaining, p.img_src
    FROM cart_item
    INNER JOIN product as p ON cart_item.product_id = p.id
    WHERE cart_item.cart_id = ${cartId};`);
    if (result) {
        res.send(result.rows)
    }
}

const getCartInfo = async (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
        res.status(400).send();
        return;
    } 

    const cartInfo = {
        id: await getCartByUserId(userId)
    }
    
    if (!cartInfo) {
        res.status(400).send();
        return;
    } else {
        res.status(200).send(cartInfo);
    }

}

const getCartByUserId = async (userId) => {
    if (!userId) {
        return;
    }
    console.log('cart requested for user', userId);
    const result = await queryDatabase(`SELECT * FROM "cart" WHERE user_id =${userId}`);
    if (result.rows.length > 0) {
        return result.rows[0].id;
    }
}

const deleteCartItem = async (req, res) => {
    const itemId = req.params.itemId;
    if (!itemId) {
        res.status(400).send();
        return;
    }
    const result = await queryDatabase(`DELETE FROM "cart_item" WHERE id = ${itemId}`);

    if (result) {
        res.status(204).send();
    } else {
        res.status(400).send();
    }
    return;
}

const postCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;

    if (!cartItem) {
        res.status(400).send();
        return;
    }

    console.log(`INSERT INTO "cart_item" (cart_id, product_id, quantity, created_at) VALUES (${cartItem.cart_id}, ${cartItem.product_id}, ${cartItem.quantity }, ${cartItem.created_at})`)
    const result = await queryDatabase(`INSERT INTO "cart_item" (cart_id, product_id, quantity, created_at) VALUES (${cartItem.cart_id}, ${cartItem.product_id}, ${cartItem.quantity }, ${cartItem.created_at})`)

    if (result) {
        res.status(201).send();
    } else {
        res.status(400).send();
    }
    return;
    
}

const patchCartItem = async (req, res) => {
    const cartItem = req.body.cartItem;

    if (!cartItem || cartItem.id != req.params.itemId) {
        res.status(400).send();
        return;
    }

    const result = 
        await queryDatabase(`UPDATE "cart_item" SET quantity = ${cartItem.quantity} WHERE id = ${cartItem.id}`);

    if (result) {
        res.status(200).send();
    } else {
        res.status(400).send();
    }
    return;
}



module.exports = {getCartItems, getCartInfo, postCartItem, patchCartItem, deleteCartItem};