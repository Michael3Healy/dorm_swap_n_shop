'use strict';

const db = require('../db');
const { sqlForPartialUpdate } = require('../helpers/sql');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

class Post {
	/**
	 * Create a new post (from data), update db, return new post data.
	 *
	 * data should be { poster_username, item_id, location_id, posted_at }
	 *
	 * Returns { id, posterUsername, itemId, locationId }
	 *
	 */
	static async create({ posterUsername, itemId, locationId }) {

		// Insert post into database
		const result = await db.query(
			`INSERT INTO posts (poster_username, item_id, location_id)
            VALUES ($1, $2, $3)
            RETURNING id, poster_username AS "posterUsername", item_id AS "itemId", 
                    location_id AS "locationId"`,
			[posterUsername, itemId, locationId]
		);

		const post = result.rows[0];

		return post;
	}

	/**
	 * Find all posts that match the given search filters.
	 *
	 * searchFilters (all optional):
	 * - itemName (case-insensitive, partial matches)
	 * - posterUsername (case-insensitive, partial matches)
	 *
	 * Returns [{ id, posterUsername, itemId, locationId, postedAt }, ...]
	 *
	 * Throws BadRequestError if no posts match the search filters.
	 *
	 */
	static async findAll(searchFilters = {}) {
		let query = `SELECT p.id,
                            p.poster_username AS "posterUsername",
                            p.item_id AS "itemId",
                            p.location_id AS "locationId",
                            p.posted_at AS "postedAt"
                     FROM posts AS p JOIN items AS i ON p.item_id = i.id`;
		let whereExpressions = [];
		let queryValues = [];

		const { itemName, posterUsername } = searchFilters;

		// For each possible search term, add to whereExpressions and queryValues so we can generate the right SQL
		if (itemName) {
			queryValues.push(`%${itemName}%`);
			whereExpressions.push(`i.title ILIKE $${queryValues.length}`);
		}

		if (posterUsername) {
			queryValues.push(`%${posterUsername}%`);
			whereExpressions.push(`poster_username ILIKE $${queryValues.length}`);
		}

		if (whereExpressions.length > 0) {
			query += ' WHERE ' + whereExpressions.join(' AND ');
		}

		// Finalize query
		query += ' ORDER BY p.posted_at DESC';

		const postsRes = await db.query(query, queryValues);

		return postsRes.rows;
	}

	/**
	 * Get a post by ID.
	 *
	 * Returns { id, posterUsername, itemId, locationId, postedAt }
	 *
	 * Throws NotFoundError if post not found.
	 */
	static async get(id) {
		const postRes = await db.query(
			`SELECT id,
                    poster_username AS "posterUsername",
                    item_id AS "itemId",
                    location_id AS "locationId",
                    posted_at AS "postedAt"
             FROM posts
             WHERE id = $1`,
			[id]
		);

		const post = postRes.rows[0];

		if (!post) throw new NotFoundError(`No post: ${id}`);

		return post;
	}

	/**
	 * Update post data with `data`.
	 *
	 * This is a "partial update" --- it is fine if data does not contain all the fields;
	 * this only changes provided fields.
	 *
	 * Data can include: { itemId, locationId }
	 *
	 * Returns { id, posterUsername, itemId, locationId }
	 *
	 * Throws NotFoundError if not found.
	 */

	static async update(id, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			itemId: 'item_id',
			locationId: 'location_id',
		});
		const idVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE posts 
                          SET ${setCols} 
                          WHERE id = ${idVarIdx} 
                          RETURNING id, poster_username AS "posterUsername", item_id AS "itemId", location_id AS "locationId"`;
		const result = await db.query(querySql, [...values, id]);
		const post = result.rows[0];

		if (!post) throw new NotFoundError(`No post: ${id}`);

		return post;
	}

	/**
	 * Delete a post by ID.
	 *
	 * Returns { id }
	 *
	 * Throws NotFoundError if post not found.
	 */
	static async delete(id) {
		const result = await db.query(
			`DELETE
             FROM posts
             WHERE id = $1
             RETURNING id`,
			[id]
		);
		const post = result.rows[0];

		if (!post) throw new NotFoundError(`No post: ${id}`);

		return post;
	}
}

module.exports = Post;
