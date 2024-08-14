'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Item {
	/** Create a new item (from data), update db, return new item data.
	 *
	 * data should be { image, category, title, price, isSold, description }
	 *
	 * Returns { id, image, category, title, price, isSold, description, ownerUsername }
	 *
	 * Throws BadRequestError if item already in database.
	 **/
	static async create({ image, category, title, price, isSold, description, ownerUsername }) {

		// Insert item into database
		const result = await db.query(
			`INSERT INTO items (image, category, title, price, is_sold, description, owner_username)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, image, category, title, price, is_sold AS "isSold", description, owner_username AS "ownerUsername"`,
			[image, category, title, price, isSold, description, ownerUsername]
		);
		const item = result.rows[0];

		return item;
	}

	static async get(id) {
		const itemRes = await db.query(
			`SELECT id, image, category, title, price, is_sold AS "isSold", description, owner_username AS "ownerUsername"
			FROM items
			WHERE id = $1`,
			[id]
		);

		const item = itemRes.rows[0];

		if (!item) throw new NotFoundError(`No item: ${id}`);

		return item;
	}

	/**
	 * Update item data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include:
	 *  { image, category, title, price, isSold, description }
	 *
	 * Returns { id, image, category, title, price, isSold, description, ownerUsername }
	 */
	static async update(data, id) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			isSold: 'is_sold',
		});

		const idVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE items
                    SET ${setCols} WHERE id = ${idVarIdx}
                    RETURNING id, image, category, title, price, is_sold AS "isSold", description, owner_username AS "ownerUsername"`;
		const result = await db.query(querySql, [...values, id]);
		const item = result.rows[0];

		if (!item) throw new NotFoundError(`No item: ${id}`);

		return item;
	}

	/**
	 * Delete item by id.
	 */
	static async delete(id) {
		const result = await db.query(
			`DELETE FROM items WHERE id = $1
                    RETURNING id`,
			[id]
		);
		const item = result.rows[0];

		if (!item) throw new NotFoundError(`No item: ${id}`);
	}
}

module.exports = Item;
