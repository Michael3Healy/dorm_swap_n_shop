'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require('../middleware/auth');
const Transaction = require('../models/transaction');
const transactionNewSchema = require('../schemas/transactions/transactionNew.json');
const transactionSearchSchema = require('../schemas/transactions/transactionSearch.json');
const transactionService = require('../services/transactionService');
const { BadRequestError } = require('../expressError');

const router = express.Router();

/** POST / { transaction } => { transaction }
 *
 * Transaction should be { postId, buyerUsername, sellerUsername, price }
 *
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate, rated }
 *
 * Authorization required: admin
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
	try {
        // Convert price and postId to a number
        req.body.price = parseFloat(req.body.price);
        req.body.postId = parseInt(req.body.postId);

		const validator = jsonschema.validate(req.body, transactionNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const transaction = await Transaction.create(req.body);
		return res.status(201).json({ transaction });
	} catch (err) {
		return next(err);
	}
});

/** GET /:id => { transaction }
 * 
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate, rated }
 * 
 * Authorization required: logged in, but only the buyer or seller can view the transaction (verified in service)
 */
router.get('/:id', ensureLoggedIn, async function (req, res, next) {
	try {
		const transaction = await transactionService.getTransaction(req.params.id, res.locals.user.username);
		return res.json({ transaction });
	} catch (err) {
		return next(err);
	}
});

/** GET / => { transactions: [ { id, postId, buyerUsername, sellerUsername, price, transactionDate, rated }, ... ] }
 *
 * filter on optional parameters:
 * - minPrice
 * - maxPrice
 * - buyerUsername
 * - sellerUsername
 * - transactionDate
 *
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate, rated }
 *
 * Authorization required: admin or correct user
 */
router.get('/', ensureLoggedIn, async function (req, res, next) {
	const q = req.query;
	if (q.minPrice !== undefined) q.minPrice = parseFloat(q.minPrice);
	if (q.maxPrice !== undefined) q.maxPrice = parseFloat(q.maxPrice);

	try {
		const validator = jsonschema.validate(q, transactionSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const username = res.locals.user.username;
		console.log('routes username', username);
		const transactions = await transactionService.findAllTransactions(username, q);
		return res.json({ transactions });
	} catch (err) {
		return next(err);
	}
});

/** PATCH /:id { rated } => { message: "Transaction rated" }
 * 
 * Transaction should include { rated }
 * 
 * Returns { message: "Transaction rated" }
 */
router.patch('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const transaction = await transactionService.updateTransaction(req.params.id, res.locals.user.username);
        return res.json({ transaction });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
