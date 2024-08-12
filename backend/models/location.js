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
		// Validate that all required fields are present and not null
		if (!street || !city || !state || !zip || latitude === null || longitude === null) {
			throw new BadRequestError('Missing or null required fields');
		}

    // Validate that latitude and longitude are numbers
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon)) {
        throw new BadRequestError("Latitude and longitude must be valid numbers");
    }

		const result = await db.query(
			`INSERT INTO locations (street, city, state, zip, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, street, city, state, zip, latitude, longitude`,
			[street, city, state, zip, latitude, longitude]
		);
		const location = result.rows[0];

		return location;
	}
}

module.exports = Location;
