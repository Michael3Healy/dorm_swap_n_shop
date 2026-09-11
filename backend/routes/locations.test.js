'use strict';

const request = require('supertest');

// The location routes geocode street/city/state through the Google Maps API
// (services/geocodingService.js -> axios). Mock axios so the tests never make a
// real HTTP request; each test sets the coordinates the "geocoder" returns.
jest.mock('axios', () => ({ get: jest.fn() }));
const axios = require('axios');

const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, u2Token, adminToken, testLocationId } = require('./_testCommon');

/** Build the response shape the Google Geocoding API returns for a hit. */
function geocodeOk(lat, lng) {
	return { data: { status: 'OK', results: [{ geometry: { location: { lat, lng } } }] } };
}

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(() => {
	axios.get.mockReset();
	return commonAfterEach();
});
afterAll(commonAfterAll);

describe('POST /', () => {
	test('creates a new location for logged in user', async () => {
		axios.get.mockResolvedValue(geocodeOk(40.712776, -74.005974));

		const res = await request(app)
			.post('/locations')
			.send({ street: '5th Avenue', city: 'New York', state: 'NY' })
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			location: {
				id: expect.any(Number),
				street: '5th Avenue',
				city: 'New York',
				state: 'NY',
				latitude: '40.712776',
				longitude: '-74.005974',
			},
		});
	});

	test('fails with 400 if required data is missing', async () => {
		const res = await request(app)
			.post('/locations')
			.send({ street: '123 Test St', city: 'Test City' })
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(400);
		expect(res.body.error.message).toEqual(['instance requires property "state"']);
	});

	test('fails with 400 if the address cannot be geocoded', async () => {
		axios.get.mockResolvedValue({ data: { status: 'ZERO_RESULTS', results: [] } });

		const res = await request(app)
			.post('/locations')
			.send({ street: 'nowhere', city: 'nowhere', state: 'ZZ' })
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(400);
	});

	test('fails with 401 if user is not logged in', async () => {
		const res = await request(app)
			.post('/locations')
			.send({ street: '5th Avenue', city: 'New York', state: 'NY' });

		expect(res.statusCode).toBe(401);
	});
});

describe('DELETE /:id', () => {
	test('deletes a location for admin', async () => {
		const res = await request(app).delete(`/locations/${testLocationId}`).set('authorization', `Bearer ${adminToken}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ deleted: `${testLocationId}` });
	});

	test('fails with 401 if not admin', async () => {
		const res = await request(app).delete(`/locations/${testLocationId}`).set('authorization', `Bearer ${u2Token}`);

		expect(res.statusCode).toBe(401);
	});
});

describe('GET /', () => {
	test('gets all locations', async () => {
		const res = await request(app).get('/locations');

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			locations: [
				{
					id: expect.any(Number),
					street: '5th Avenue',
					city: 'New York',
					state: 'NY',
					latitude: '40.712776',
					longitude: '-74.005974',
				},
			],
		});
	});

	test('gets locations with filters', async () => {
		axios.get.mockResolvedValue(geocodeOk(46.789, 92.546));
		await request(app)
			.post('/locations')
			.send({ street: '456 Test St', city: 'Another City', state: 'OX' })
			.set('authorization', `Bearer ${u1Token}`);

		const res = await request(app).get('/locations').query({ state: 'OX' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			locations: [
				{
					id: expect.any(Number),
					street: '456 Test St',
					city: 'Another City',
					state: 'OX',
					latitude: '46.789000',
					longitude: '92.546000',
				},
			],
		});
	});
});
