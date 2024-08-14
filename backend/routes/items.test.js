'use strict';

const request = require('supertest');
const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, u2Token, testItemIds } = require('./_testCommon');

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

describe('PATCH /:id', () => {
	test('updates an item for logged in user', async () => {
		const res = await request(app).patch(`/items/${testItemIds[0]}`).send({ price: 499.99 }).set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({
			item: {
				id: testItemIds[0],
				image: 'http://item1.img',
				category: 'Category1',
				title: 'Item1',
				price: '499.99',
				isSold: false,
				description: 'Description for item 1',
				ownerUsername: 'u1',
			},
		});
	});

	test('fails with 400 if data is invalid', async () => {
		const res = await request(app).patch(`/items/${testItemIds[0]}`).send({ price: 'not-a-number' }).set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toBe(400);
		expect(res.body.error.message).toEqual(['instance.price is not of a type(s) number']);
	});

	test('fails with 401 if user is not logged in', async () => {
		const res = await request(app).patch(`/items/${testItemIds[0]}`).send({ price: 499.99 });
		expect(res.statusCode).toBe(401);
		expect(res.body.error.message).toEqual('Unauthorized');
	});

	test('fails with 401 if user does not own the item', async () => {
		const res = await request(app).patch(`/items/${testItemIds[0]}`).send({ price: 499.99 }).set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toBe(401);
		expect(res.body.error.message).toEqual('User does not own this item');
	});
});

describe('DELETE /:id', () => {
	test('deletes an item for logged in user', async () => {
		const res = await request(app).delete(`/items/${testItemIds[0]}`).set('authorization', `Bearer ${u1Token}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: 'Item deleted' });
	});

	test('fails with 401 if user is not logged in', async () => {
		const res = await request(app).delete(`/items/${testItemIds[0]}`);
		expect(res.statusCode).toBe(401);
		expect(res.body.error.message).toEqual('Unauthorized');
	});

	test('fails with 401 if user does not own the item', async () => {
		const res = await request(app).delete(`/items/${testItemIds[0]}`).set('authorization', `Bearer ${u2Token}`);
		expect(res.statusCode).toBe(401);
		expect(res.body.error.message).toEqual('User does not own this item');
	});
});
