'use strict';

const request = require('supertest');
const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, adminToken, u2Token, u1Token, testPostIds, testLocationId } = require('./_testCommon');


beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /transactions', function () {
	test('ok for admin', async function () {
		const response = await request(app)
			.post('/transactions')
			.send({
				postId: testPostIds[0],
				buyerUsername: 'u2',
				sellerUsername: 'u1',
				price: 10.5,
			})
			.set('authorization', `Bearer ${adminToken}`);

		expect(response.statusCode).toEqual(201);
		expect(response.body).toEqual({
			transaction: {
				id: expect.any(Number),
				postId: testPostIds[0],
				buyerUsername: 'u2',
				sellerUsername: 'u1',
				price: '10.5',
				transactionDate: expect.any(String),
			},
		});
	});
});
