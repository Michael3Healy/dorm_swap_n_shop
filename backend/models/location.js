'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

/** Related functions for locations. */

class Location {
	/** Create a location (from data), update db, return new location data.
	 *
	 * data should be { latitude, longitude, street, city, state, zip }
	 *
	 * Returns { id, street, city, state, zip, latitude, longitude }
	 **/

	static async create({ street, city, state, zip, latitude, longitude }) {
		const result = await db.query(
			`INSERT INTO locations (street, city, state, zip, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, street, city, state, zip, latitude, longitude`,
			[street, city, state, zip, latitude, longitude]
		);
		const location = result.rows[0];

		return location;
	}

	/**
	 * Find all locations that match the given search filters.
	 * 
	 * searchFilters (all optional):
	 * - street (case-insensitive, partial matches)
	 * - city (case-insensitive, partial matches)
	 * - state (case-insensitive, partial matches)
	 * 
	 * Returns [{ id, street, city, state, zip, latitude, longitude }, ...]
	 */
	static async findAll(searchFilters = {}) {
		let query = `SELECT id,
							street,
							city,
							state,
							zip,
							latitude,
							longitude
					 FROM locations`;
		let whereExpressions = [];
		let queryValues = [];

		const { street, city, state } = searchFilters;

		// For each possible search term, add to whereExpressions and queryValues so we can generate the right SQL
		if (street) {
			queryValues.push(`%${street}%`);
			whereExpressions.push(`street ILIKE $${queryValues.length}`);
		}

		if (city) {
			queryValues.push(`%${city}%`);
			whereExpressions.push(`city ILIKE $${queryValues.length}`);
		}

		if (state) {
			queryValues.push(`%${state}%`);
			whereExpressions.push(`state ILIKE $${queryValues.length}`);
		}

		if (whereExpressions.length > 0) {
			query += ' WHERE ' + whereExpressions.join(' AND ');
		}

		// Finalize query and return results
		query += ' ORDER BY street';
		const locationsRes = await db.query(query, queryValues);
		return locationsRes.rows;
	}
	
	/**
	 * Delete location with given id.
	 *
	 * Returns { id }
	 */
	static async delete(id) {
		const result = await db.query(
			`DELETE
			 FROM locations
			 WHERE id = $1
			 RETURNING id`,
			[id]
		);
		const location = result.rows[0];

		if (!location) throw new NotFoundError(`No location: ${id}`);

		return location;
	}
}

module.exports = Location;
