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
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate }
 * 
 * Authorization required: admin
 */
router.post('/', ensureAdmin, async function (req, res, next) {
    try {
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

/** GET / => { transactions: [ { id, postId, buyerUsername, sellerUsername, price, transactionDate }, ... ] }
 * 
 * filter on optional parameters:
 * - minPrice
 * - maxPrice
 * - buyerUsername
 * - sellerUsername
 * - transactionDate
 * 
 * Returns { id, postId, buyerUsername, sellerUsername, price, transactionDate }
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
        const transactions = await transactionService.findAll(q, username);
        return res.json({ transactions });
    } catch (err) {
        return next(err);
    }
}
);

module.exports = router;