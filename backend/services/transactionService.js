const Transaction = require('../models/transaction');
const { BadRequestError } = require('../expressError');


/**
 * Create a new transaction (from data), update db, return new transaction data.
 * 
 * data should be { postId, buyerUsername, sellerUsername, price, transactionDate }
 * 
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate }
 */
async function findAll(query, username) {
    // Check if minPrice is greater than maxPrice
    const { minPrice, maxPrice } = query;
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        throw new BadRequestError('Min price cannot be greater than max price');
    }
    try {
        const transactions = await Transaction.findAll(query, username);
        return transactions;
    } catch (err) {
        throw err;
    }
}

module.exports = { findAll };