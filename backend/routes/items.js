'use strict';

const express = require('express');
const router = new express.Router();
const jsonschema = require('jsonschema');
const multer = require('multer');
const path = require('path');

const { BadRequestError } = require('../expressError');
const Item = require('../models/item');
const { ensureLoggedIn } = require('../middleware/auth');
const itemService = require('../services/itemService');
const itemNewSchema = require('../schemas/items/itemNew.json');
const itemUpdateSchema = require('../schemas/items/itemUpdate.json');

// Set storage options for multer
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/'); // The folder where the uploaded files will be stored
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Naming the file uniquely
	},
});

const upload = multer({ storage: storage });

// const itemNewSchema = require('../schemas/itemNew.json')

/**
 * Route to add new item
 *
 * POST / { image, category, title, price, locationId, description } => { item }
 *
 * Authorization required: logged in
 */
router.post('/', ensureLoggedIn, upload.single('image'), async function (req, res, next) {
	try {
		// Convert price to a number
		req.body.price = parseFloat(req.body.price);

		// Update the request body to include the profile picture path
		if (req.file) req.body.image = req.file.path;

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

/** Route to get an item by id
 *
 * GET /:id => { item }
 * 
 * Returns { id, image, category, title, price, isSold, description, ownerUsername }
 */
router.get('/:id', async function (req, res, next) {
	try {
		const item = await Item.get(req.params.id);
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
