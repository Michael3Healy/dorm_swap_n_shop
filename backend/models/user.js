'use strict';

const db = require('../db');
const bcrypt = require('bcrypt');
const { sqlForPartialUpdate } = require('../helpers/sql');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

/** Related functions for users. */

class User {
	/** authenticate user with username, password.
	 *
	 * Returns { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture }
	 *
	 * Throws UnauthorizedError is user not found or wrong password.
	 **/

	static async authenticate(username, password) {
		// try to find the user first
		const result = await db.query(
			`SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin",
                  phone_number AS "phoneNumber",
                  profile_picture AS "profilePicture"
           FROM users
           WHERE username = $1`,
			[username]
		);

		const user = result.rows[0];

		if (user) {
			// compare hashed password to a new hash from password
			const isValid = await bcrypt.compare(password, user.password);
			if (isValid === true) {
				delete user.password;
				return user;
			}
		}

		throw new UnauthorizedError('Invalid username/password');
	}

	/** Register user with data.
	 *
	 * Returns { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture }
	 *
	 * Throws BadRequestError on duplicates.
	 **/

	static async register({ username, password, firstName, lastName, email, isAdmin, phoneNumber, profilePicture }) {
		const duplicateCheck = await db.query(
			`SELECT username
           FROM users
           WHERE username = $1`,
			[username]
		);

		if (duplicateCheck.rows[0]) {
			throw new BadRequestError(`Duplicate username: ${username}`);
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

		const result = await db.query(
			`INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            is_admin,
            phone_number,
            profile_picture)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, is_admin AS "isAdmin", phone_number AS "phoneNumber", profile_picture AS "profilePicture"`,
			[username, hashedPassword, firstName, lastName, email, isAdmin, phoneNumber, profilePicture]
		);

		const user = result.rows[0];

		return user;
	}

	/** Find all users. (optional filters)
	 *
	 * filters:
	 * - rating
	 * - username (case-insensitive, partial matches)
	 *
	 * Returns [{ username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, rating, num_ratings }, ...]
	 **/

	static async findAll(searchFilters = {}) {
		let query = `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin",
                  phone_number AS "phoneNumber",
                  profile_picture AS "profilePicture",
				  rating,
				  num_ratings AS "numRatings"
           FROM users`;
		let whereExpressions = [];
		let queryValues = [];

		const { rating, username } = searchFilters;

		if (rating < 0 || rating > 5) {
			throw new BadRequestError('Rating must be between 0 and 5');
		}

		// For each possible search term, add to whereExpressions and queryValues so
		// we can generate the right SQL

		if (rating !== undefined) {
			queryValues.push(rating);
			whereExpressions.push(`rating >= $${queryValues.length}`)
		}

		if (username !== undefined) {
			queryValues.push(`%${username}%`);
			whereExpressions.push(`username ILIKE $${queryValues.length}`)
		}

		if (whereExpressions.length > 0) {
			query += " WHERE " + whereExpressions.join(" AND ");
		}

		query += " ORDER BY rating DESC "

		const usersRes = await db.query(query, queryValues);

		return usersRes.rows;
	}

	/** Given a username, return data about user.
	 *
	 * Returns { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, posts, transactions, rating, numRatings }
	 *   where posts is [{ id, title, category, description, price, locationId, isSold, image }, ...]
	 *   and where transactions is [{ id, postId, buyerId, sellerId, price, date }, ...]
	 *
	 * Throws NotFoundError if user not found.
	 **/

	static async get(username) {
		const userRes = await db.query(
			`SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  is_admin AS "isAdmin",
                  phone_number AS "phoneNumber",
                  profile_picture AS "profilePicture",
				  rating,
				  num_ratings AS "numRatings"
           FROM users
           WHERE username = $1`,
			[username]
		);

		const user = userRes.rows[0];

		if (!user) throw new BadRequestError(`User with username ${username} not found`);

		const userPostsRes = await db.query(
			`SELECT id, item_id AS "itemId", location_id AS "locationId", posted_at AS "postedAt"
           FROM posts
           WHERE poster_username = $1`,
			[username]
		);

		user.posts = userPostsRes.rows;

		const userTransactionsRes = await db.query(
			`SELECT id, post_id AS "postId", buyer_username AS "buyerUsername", seller_username AS "sellerUsername", price, transaction_date AS "transactionDate"
           FROM transactions
           WHERE buyer_username = $1 OR seller_username = $1`,
			[username]
		);

		user.transactions = userTransactionsRes.rows;

		return user;
	}

	/** Update user data with `data`.
	 *
	 * This is a "partial update" --- it's fine if data doesn't contain
	 * all the fields; this only changes provided ones.
	 *
	 * Data can include:
	 *   { firstName, lastName, email, phoneNumber, profilePicture }
	 *
	 * Returns { username, firstName, lastName, email, phoneNumber, profilePicture }
	 *
	 * Throws NotFoundError if not found.
	 *
	 */

	static async update(username, data) {
		const { setCols, values } = sqlForPartialUpdate(data, {
			firstName: 'first_name',
			lastName: 'last_name',
			phoneNumber: 'phone_number',
			profilePicture: 'profile_picture',
		});

		const usernameVarIdx = '$' + (values.length + 1);

		const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                phone_number AS "phoneNumber",
                                profile_picture AS "profilePicture"`;
		const result = await db.query(querySql, [...values, username]);
		const user = result.rows[0];

		return user;
	}

	/** Delete given user from database; returns undefined. */

	static async remove(username) {
		let result = await db.query(
			`DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
			[username]
		);
		const user = result.rows[0];

		if (!user) throw new NotFoundError(`No user: ${username}`);
	}

	/**
	 * Update user rating
	 * 
	 * Returns { username, rating, numRatings }
	 * 
	 * Throws NotFoundError if user not found
	 */

	static async addRating(username, rating) {
		let currRatingRes = await db.query(
			`SELECT rating AS curr_rating, num_ratings
			FROM users
			WHERE username = $1`,
			[username]
		)
		const user = currRatingRes.rows[0]

		if (!user) throw new NotFoundError(`No user: ${username}`);

		// Get current rating and number of ratings to calculate new rating
		let { curr_rating, num_ratings } = user;
		if (curr_rating === null || curr_rating === undefined) curr_rating = 0;
		let totalRating = curr_rating * num_ratings

		// Add new rating and update num_ratings
		totalRating += rating;
		num_ratings += 1;

		// Calculate new rating
		const newRating = totalRating / num_ratings;

		let result = await db.query(
			`UPDATE users SET rating = $1, num_ratings = $2 WHERE username = $3 RETURNING username, rating, num_ratings AS "numRatings"`,
			[newRating, num_ratings, username]
		)
		
		const updatedUser = result.rows[0];

		return updatedUser;
	}
}

module.exports = User;
