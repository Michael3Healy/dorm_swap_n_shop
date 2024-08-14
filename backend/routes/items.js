'use strict';

const express = require('express');
const router = new express.Router();
const jsonschema = require('jsonschema');

const { BadRequestError } = require('../expressError');
const Item = require('../models/item');
const { ensureLoggedIn } = require('../middleware/auth');
const itemService = require('../services/itemService');
const itemNewSchema = require('../schemas/items/itemNew.json');
const itemUpdateSchema = require('../schemas/items/itemUpdate.json');

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
		const username = res.locals.user.username;
		const item = await Item.create({ ...req.body, ownerUsername: username });
		return res.json({ item });
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to update item
 *
 * PATCH / { image, category, title, price, isSold, description } => { item }
 *
 * Authorization required: logged in
 */
router.patch('/:id', ensureLoggedIn, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, itemUpdateSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const username = res.locals.user.username;
		const item = await itemService.updateItem(req.body, req.params.id, username);
		return res.json({ item });
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to delete item
 * 
 * DELETE /:id => {"Deleted": id}
 * 
 * */
router.delete('/:id', ensureLoggedIn, async function (req, res, next) {
	try {
		const username = res.locals.user.username;
		await itemService.deleteItem(req.params.id, username);
		return res.json({ message: 'Item deleted' });
	} catch (err) {
		return next(err);
	}
});


module.exports = router;
