'use strict';

const express = require('express');
const router = new express.Router();
const jsonschema = require('jsonschema');

const { BadRequestError } = require('../expressError');
const Location = require('../models/location');

const locationNewSchema = require('../schemas/locations/locationNew.json');
const locationSearchSchema = require('../schemas/locations/locationSearch.json');
const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth');

/**
 * Route to add new location
 *
 * POST / { street, city, state, zip, latitude, longitude } => { location }
 *
 * Authorization required: logged in
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
	console.log('req.body:', req.body);
	try {
		console.log('Incoming longitude:', req.body.longitude);
		console.log('Incoming latitude:', req.body.latitude);

		// Convert to float
		req.body.longitude = parseFloat(req.body.longitude);
		req.body.latitude = parseFloat(req.body.latitude);

		// Log values after conversion
		console.log('Converted longitude:', req.body.longitude);
		console.log('Converted latitude:', req.body.latitude);
		const validator = jsonschema.validate(req.body, locationNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const location = await Location.create(req.body);
		return res.json({ location });
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to update location
 *
 * GET / => { locations: [ { id, street, city, state, zip, latitude, longitude }, ...] }
 *
 * Can filter on provided search filters:
 * - street (case-insensitive, partial matches)
 * - city (case-insensitive, partial matches)
 * - state (case-insensitive, partial matches)
 *
 * Authorization required: none
 */
router.get('/', async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.query, locationSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const locations = await Location.findAll(req.query);
		return res.json({ locations });
	} catch (err) {
		return next(err);
	}
});

/** Route to get location by id
 *
 * GET /:id => { location }
 *
 * Returns { id, street, city, state, zip, latitude, longitude }
 */
router.get('/:id', async function (req, res, next) {
	try {
		const location = await Location.get(req.params.id);
		return res.json({ location });
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to delete location
 *
 * DELETE /:id => { deleted: id }
 *
 * Authorization required: admin
 */
router.delete('/:id', ensureAdmin, async function (req, res, next) {
	try {
		const id = req.params.id;
		await Location.delete(id);
		return res.json({ deleted: id });
	} catch (err) {
		return next(err);
	}
});

module.exports = router;
