'use strict';

const express = require('express');
const router = new express.Router();
const jsonschema = require('jsonschema');

const { BadRequestError } = require('../expressError');
const Item = require('../models/item');
const { ensureLoggedIn } = require('../middleware/auth');
const itemNewSchema = require('../schemas/items/itemNew.json');

// const itemNewSchema = require('../schemas/itemNew.json')

/**
 * Route to add new item
 *
 * POST / { image, category, title, price, locationId, isSold, description } => { item }
 *
 * Authorization required: logged in
 */
router.post('/new', ensureLoggedIn, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, itemNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const item = await Item.create(req.body);
		return res.json({ item });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
