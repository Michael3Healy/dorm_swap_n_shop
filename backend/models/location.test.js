'use strict';

const db = require('../db');
const Location = require('./location');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function () {
	const newLocation = {
		street: '123 Main St',
		city: 'New York',
		state: 'NY',
		zip: '10001',
		latitude: '40.712800',
		longitude: '-74.006000',
	};

	test('works', async function () {
		const location = await Location.create(newLocation);
		expect(location).toEqual({
			id: expect.any(Number),
			street: '123 Main St',
			city: 'New York',
			state: 'NY',
			zip: '10001',
			latitude: '40.712800',
			longitude: '-74.006000',
		});

		const result = await db.query(
			`SELECT id, street, city, state, zip, latitude, longitude
           FROM locations
           WHERE id = $1`,
			[location.id]
		);
		expect(result.rows).toEqual([
			{
				id: location.id,
				street: '123 Main St',
				city: 'New York',
				state: 'NY',
				zip: '10001',
				latitude: '40.712800',
				longitude: '-74.006000',
			},
		]);
	});

	test('bad request with missing data', async function () {
		try {
			await Location.create({
				city: 'New York',
				state: 'NY',
				zip: '10001',
			});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});

	test('bad request with invalid data', async function () {
		try {
			await Location.create({
				street: '123 Main St',
				city: 'New York',
				state: 'NY',
				zip: '10001',
				latitude: 'invalid',
				longitude: '-74.006000',
			});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});
