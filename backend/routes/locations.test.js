'use strict';

const request = require('supertest');
const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, u2Token, testItemIds, adminToken, testLocationId } = require('./_testCommon');

const newLocation = {
	street: "5th Avenue",
	city: "New York",
	state: "NY",
	zip: "10001",
	latitude: 40.712776,
	longitude: -74.005974
};

const newLocation2 = {
	street: '456 Test St',
	city: 'Another City',
	state: 'OX',
	zip: '12345',
	latitude: 46.789,
	longitude: 92.546,
};

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /new', () => {
	test('creates a new location for logged in user', async () => {
		const res = await request(app).post('/locations/new').send(newLocation).set('authorization', `Bearer ${u1Token}`);
		console.log('res.body', res.body);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			location: {
				id: expect.any(Number),
				...newLocation,
				latitude: '40.712776',
				longitude: '-74.005974',
			},
		});
	});

	test('fails with 400 if required data is missing', async () => {
		const res = await request(app)
			.post('/locations/new')
			.send({
				street: '123 Test St',
				city: 'Test City',
				state: 'TS',
				zip: '12345',
			})
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(400);
		expect(res.body.error.message).toEqual(['instance requires property "latitude"', 'instance requires property "longitude"']);
	});

	test('fails with 400 if data is invalid', async () => {
		const res = await request(app)
			.post('/locations/new')
			.send({
				...newLocation,
				latitude: 'not-a-number', // Invalid latitude
			})
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(400);
	});
});

describe('DELETE /:id', () => {
	test('deletes a location for admin', async () => {
		const res = await request(app).delete(`/locations/${testLocationId}`).set('authorization', `Bearer ${adminToken}`);
		console.log('res.body', res.body);
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
					...newLocation,
					latitude: '40.712776',
					longitude: '-74.005974',
				},
			],
		});
	});

	test('gets locations with filters', async () => {
		await request(app).post('/locations/new').send(newLocation2).set('authorization', `Bearer ${u1Token}`);
		await request(app).post('/locations/new').send(newLocation).set('authorization', `Bearer ${u1Token}`);

		const res = await request(app).get('/locations').query({ state: 'OX' });
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			locations: [
				{
					id: expect.any(Number),
					...newLocation2,
					latitude: '46.789000',
					longitude: '92.546000',
				},
			],
		});
	});
});
