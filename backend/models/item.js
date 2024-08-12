'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');
const { sqlForPartialUpdate } = require('../helpers/sql');

class Item {
	/** Create a new item (from data), update db, return new item data.
	 *
	 * data should be { image, category, title, price, locationId, isSold, description }
	 *
	 * Returns { id, image, category, title, price, locationId, isSold, description }
	 *
	 * Throws BadRequestError if item already in database.
	 **/
	static async create({ image, category, title, price, locationId: location_id, isSold: is_sold, description }) {
		const result = await db.query(
			`INSERT INTO items (image, category, title, price, location_id, is_sold, description)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, image, category, title, price, location_id AS "locationId", is_sold AS "isSold", description`,
			[image, category, title, price, location_id, is_sold, description]
		);
		const item = result.rows[0];

		return item;
	}


    /**
     * Update item data with `data`.
     * 
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     * 
     * Data can include:
     *  { image, category, title, price, locationId, isSold, description }
     * 
     * Returns { id, image, category, title, price, locationId, isSold, description }
     */
	static async update(data, id) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			locationId: 'location_id',
			isSold: 'is_sold',
		});

		const idVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE items
                    SET ${setCols} WHERE id = ${idVarIdx}
                    RETURNING id, image, category, title, price, location_id AS "locationID", is_sold AS "isSold", description`;
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
                    RETURNING id`, [id]);
        const item = result.rows[0];

        if (!item) throw new NotFoundError(`No item: ${id}`)
    }
}

module.exports = Item;
