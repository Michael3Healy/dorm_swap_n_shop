const Item = require('../models/item');
const { UnauthorizedError, BadRequestError } = require('../expressError');
const db = require('../db');

async function updateItem(data, id, username) {
    try {
        const item = await Item.get(id);
        if (item.ownerUsername !== username) throw new UnauthorizedError('User does not own this item');

        const updatedItem = await Item.update(data, id);
        return updatedItem;
    } catch (error) {
        throw error;
    }
}

async function deleteItem(id, username) {
    try {
        const item = await Item.get(id);
        if (item.ownerUsername !== username) throw new UnauthorizedError('User does not own this item');

        await Item.delete(id);
    } catch (error) {
        throw error;
    }
}

module.exports = { updateItem, deleteItem };