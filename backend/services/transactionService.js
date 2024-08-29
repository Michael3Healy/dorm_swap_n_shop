const Transaction = require('../models/transaction');
const { BadRequestError } = require('../expressError');


/**
 * Create a new transaction (from data), update db, return new transaction data.
 * 
 * data should be { postId, buyerUsername, sellerUsername, price, transactionDate }
 * 
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate }
 */
async function findAllTransactions(username, query) {
    // Check if minPrice is greater than maxPrice
    const { minPrice, maxPrice } = query;
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
        throw new BadRequestError('Min price cannot be greater than max price');
    }
    try {
        const transactions = await Transaction.findAll(username, query);
        return transactions;
    } catch (err) {
        throw err;
    }
}


/**
 * Get a transaction by id
 * 
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate }
 */
async function getTransaction(id, username) {
    try {
        const transaction = await Transaction.get(id);
        if (transaction.buyerUsername !== username && transaction.sellerUsername !== username) {
            console.log(transaction.buyerUsername, transaction.sellerUsername, username);
            throw new BadRequestError('You are not authorized to view this transaction');
        }
        return transaction;
    } catch (err) {
        throw err;
    }
}

/**
 * Update a transaction by id
 * 
 * Protections: only the buyer can update the transaction and only if it has not been rated
 * 
 * Returns { rated }
 */
async function updateTransaction(id, username) {
    try {
        const transaction = await Transaction.get(id);
        if (transaction.rated) {
            throw new BadRequestError('Transaction has already been rated');
        }
        if (transaction.buyerUsername !== username) {
            throw new BadRequestError('You are not authorized to update this transaction');
        }
        const result = await Transaction.update(id);
        return result;
    } catch (err) {
        throw err;
    }
}

module.exports = { findAllTransactions, getTransaction, updateTransaction };