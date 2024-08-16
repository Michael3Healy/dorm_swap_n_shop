'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

class Transaction {
	/**
	 * Create a new transaction (from data), update db, return new transaction data.
	 *
	 * data should be { post_id, buyer_username, seller_username, price }
	 *
	 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate }
	 *
	 */
	static async create({ postId, buyerUsername, sellerUsername, price }) {
		// Insert transaction into database
		const result = await db.query(
			`INSERT INTO transactions (post_id, buyer_username, seller_username, price)
             VALUES ($1, $2, $3, $4)
             RETURNING id, post_id AS "postId", buyer_username AS "buyerUsername", seller_username AS "sellerUsername", price, transaction_date AS "transactionDate"`,
			[postId, buyerUsername, sellerUsername, price]
		);

		const transaction = result.rows[0];

		return transaction;
	}

	/**
	 * Find all transactions that match the query parameters.
	 *
	 * query can include { minPrice, maxPrice, buyerUsername, sellerUsername, transactionDate }
	 *
	 * Returns [{ id, postId, buyerUsername, sellerUsername, price, transactionDate }, ...]
	 *
	 */
	static async findAll(username, query={}) {
		let whereExpressions = [];
		let queryValues = [username];
		let i = 2;

		if (query.minPrice !== undefined) {
			queryValues.push(query.minPrice);
			whereExpressions.push(`price >= $${i}`);
			i++;
		}

		if (query.maxPrice !== undefined) {
			queryValues.push(query.maxPrice);
			whereExpressions.push(`price <= $${i}`);
			i++;
		}

		if (query.buyerUsername !== undefined) {
			queryValues.push(query.buyerUsername);
			whereExpressions.push(`buyer_username = $${i}`);
			i++;
		}

		if (query.sellerUsername !== undefined) {
			queryValues.push(query.sellerUsername);
			whereExpressions.push(`seller_username = $${i}`);
			i++;
		}

		if (query.transactionDate !== undefined) {
			queryValues.push(query.transactionDate);
			whereExpressions.push(`transaction_date = $${i}`);
			i++;
		}

        whereExpressions.push(`(buyer_username = $1 OR seller_username = $1)`);

		let whereClause = whereExpressions.join(' AND ');
		if (whereClause.length > 0) {
			whereClause = 'WHERE ' + whereClause;
		}

		const transactionsRes = await db.query(
			`SELECT id,
                    post_id AS "postId",
                    buyer_username AS "buyerUsername",
                    seller_username AS "sellerUsername",
                    price,
                    transaction_date AS "transactionDate"
             FROM transactions
             ${whereClause}
             ORDER BY id`,
			queryValues
		);

        if (transactionsRes.rows.length === 0) {
            throw new NotFoundError('No transactions found');
        }

		return transactionsRes.rows;
	}
}

module.exports = Transaction;
