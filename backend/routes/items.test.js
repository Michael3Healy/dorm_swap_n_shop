'use strict';

const request = require('supertest');
const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token } = require('./_testCommon');

const newItem = {
	image: 'http://example.com/image.jpg',
	category: 'Electronics',
	title: 'Smartphone',
	price: 399.99,
	isSold: false,
	description: 'Brand new smartphone',
};

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('POST /new', () => {
	test('creates a new item for logged in user', async () => {
		const res = await request(app).post('/items/new').send(newItem).set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			item: {
				id: expect.any(Number),
				...newItem,
				ownerUsername: 'u1',
                price: '399.99',
			},
		});
	});

	test('fails with 400 if required data is missing', async () => {
		const res = await request(app)
			.post('/items/new')
			.send({
				image: 'http://example.com/image.jpg',
				title: 'Smartphone',
				price: 399.99,
				isSold: false,
			})
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(400);
		expect(res.body.error.message).toEqual(['instance requires property "category"', 'instance requires property "description"']);
	});

	test('fails with 400 if data is invalid', async () => {
		const res = await request(app)
			.post('/items/new')
			.send({
				...newItem,
				price: 'not-a-number', // Invalid price
			})
			.set('authorization', `Bearer ${u1Token}`);

		expect(res.statusCode).toBe(400);
		expect(res.body.error.message).toEqual(['instance.price is not of a type(s) number']);
	});

	test('fails with 401 if user is not logged in', async () => {
		const res = await request(app).post('/items/new').send(newItem);

		expect(res.statusCode).toBe(401);
		expect(res.body.error.message).toEqual('Unauthorized');
	});
});
