'use strict';

const db = require('../db');
const Location = require('./location');

const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function () {
	test('works', async function () {
		const location = await Location.create('123 Main St', 'New York', 'NY', 40.712776, -74.005974);
		expect(location).toEqual({
			id: expect.any(Number),
			street: '123 Main St',
			city: 'New York',
			state: 'NY',
			latitude: '40.712776',
			longitude: '-74.005974',
		});

		const result = await db.query(
			`SELECT id, street, city, state, latitude, longitude
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
				latitude: '40.712776',
				longitude: '-74.005974',
			},
		]);
	});
});
