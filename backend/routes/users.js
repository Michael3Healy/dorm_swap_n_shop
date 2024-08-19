'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const User = require('../models/user');
const userUpdateSchema = require('../schemas/users/userUpdate.json');
const userSearchSchema = require('../schemas/users/userSearch.json');
const userRatingSchema = require('../schemas/users/userRating.json');
const userService = require('../services/userService');

const router = express.Router();

/**
 * Route to update user (from profile page)
 *
 * PATCH /:username { user } => { user }
 *
 * Data can include: {email, firstName, lastName, phoneNumber, profilePicture}
 *
 * Returns { username, firstName, lastName, email, phoneNumber, profilePicture }
 *
 * Authorization: admin or correct user
 */

router.patch('/:username', ensureCorrectUserOrAdmin, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const user = await User.update(req.params.username, req.body);
		return res.status(201).json(user);
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to search for users (to find their posts and transactions and reviews)
 *
 * GET / => { users: [{ username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture }, ...]}
 *
 * Can filter on provided search filters in query:
 * - username (case-insensitive)
 * - rating
 *
 * Authorization required: logged in
 */
router.get('/', ensureLoggedIn, async function (req, res, next) {
	const q = req.query;

	if (q.rating !== undefined) q.rating = +q.rating;
	try {
		const validator = jsonschema.validate(q, userSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}

		const users = await User.findAll(q);
		return res.json({ users });
	} catch (err) {
		return next(err);
	}
});

/** Route to get user by username
 *
 * GET /:username => { user }
 *
 * Returns { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, posts, transactions, rating, numRatings }
 * 
 * Authorization: logged in
 */
router.get('/:username', ensureLoggedIn, async function (req, res, next) {
	try {
		const user = await userService.getUser(req.params.username, res.locals.user);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to update user rating
 *
 * PATCH /:username/rating/:seller { rating } => { username, rating, numRatings }
 *
 * Authorization: admin or correct user (buyer)
 */

router.patch('/:username/rating/:seller', ensureCorrectUserOrAdmin, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, userRatingSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const user = await User.addRating(req.params.seller, req.body.rating);
		return res.json({ user });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
