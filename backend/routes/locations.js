'use strict';

const express = require('express');
const router = new express.Router();
const jsonschema = require('jsonschema');

const { BadRequestError } = require('../expressError');
const Location = require('../models/location');

const locationNewSchema = require('../schemas/locations/locationNew.json');
const locationSearchSchema = require('../schemas/locations/locationSearch.json');
const { ensureLoggedIn, ensureAdmin } = require('../middleware/auth');
const geocodingService = require('../services/geocodingService');

/**
 * Route to geocode address and add location to database.
 *
 * POST / { street, city, state } => { location }
 *
 * Authorization required: logged in
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
	try {
		const { street, city, state } = req.body;
		const validator = jsonschema.validate(req.body, locationNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const location = await geocodingService.createGeocodedLocation(street, city, state);
		return res.json({ location });
	} catch (err) {
		return next(err);
	}
});

/**
 * Route to search for locations
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

router.get('/:id/map', async function (req, res, next) {
	try {
		const { id } = req.params;
		const { size } = req.query;
		const map = await geocodingService.getStaticMap({ id, size });

		res.setHeader('Content-Type', 'image/png');
		return res.send(map);
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
