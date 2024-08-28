const axios = require('axios');
const Location = require('../models/location');
const { BadRequestError } = require('../expressError');

const API_KEY = process.env.GEOCODING_API_KEY;

/**
 * Create a geocoded location from an address
 */
const createGeocodedLocation = async (street, city, state) => {
	try {
		const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${street},+${city},+${state}&key=${API_KEY}`;
		const response = await axios.get(url);
		if (response.data.status !== 'OK') throw new BadRequestError('Invalid address');

		const { lat: latitude, lng: longitude } = response.data.results[0].geometry.location;
		const result = await Location.create(street, city, state, latitude, longitude);
		return result;
	} catch (err) {
		throw new BadRequestError(err);
	}
};

/**
 * Get static map image for location
 */
const getStaticMap = async ({ id, size }) => {
	try {
		const location = await Location.get(id);
		const { street, city, state } = location;

		const url = `https://maps.googleapis.com/maps/api/staticmap?size=${size}&markers=${street},${city},${state}&key=${API_KEY}`;
        const response = await axios.get(url, { responseType: 'arraybuffer' });

		return response.data;
	} catch (err) {
		throw new BadRequestError(err);
	}
};

module.exports = { createGeocodedLocation, getStaticMap };
