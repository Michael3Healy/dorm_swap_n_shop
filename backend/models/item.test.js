'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');
const Item = require('./item');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testItemIds } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', () => {
	it('should create a new item successfully', async () => {
		const newItem = {
			image: '/images/item4.png',
			category: 'Tools',
			title: 'Hammer',
			price: '19.99',
			isSold: false,
			description: 'A strong and durable hammer.',
			ownerUsername: 'u1',
		};

		let item = await Item.create(newItem);
		expect(item).toEqual({
			...newItem,
			id: expect.any(Number),
		});

		// Verify item is actually in the database
		const result = await db.query(`SELECT * FROM items WHERE id = $1`, [item.id]);
		expect(result.rows[0]).toEqual({
			id: item.id,
            image: '/images/item4.png',
            category: 'Tools',
            title: 'Hammer',
            price: '19.99',
            is_sold: false,
            description: 'A strong and durable hammer.',
			owner_username: 'u1',
		});
	});
});

/************************************** update */

describe('update', () => {
	it('should update an existing item successfully', async () => {
		const updateData = {
			title: 'Updated Laptop',
			price: '899.99',
			description: 'An updated description for a powerful laptop.',
		};

		let updatedItem = await Item.update(updateData, testItemIds[0]);
		expect(updatedItem).toEqual({
			id: testItemIds[0],
			image: '/images/item1.png',
			category: 'Electronics',
			title: updateData.title,
			price: updateData.price,
			isSold: false,
			description: updateData.description,
			ownerUsername: 'u1',
		});

		// Verify item is actually updated in the database
		const result = await db.query(`SELECT * FROM items WHERE id = $1`, [testItemIds[0]]);
		expect(result.rows[0]).toEqual({
			id: testItemIds[0],
			image: '/images/item1.png',
			category: 'Electronics',
			title: updateData.title,
			price: updateData.price,
			is_sold: false,
			description: updateData.description,
			owner_username: 'u1',
		});
	});

	it('should throw NotFoundError if item does not exist', async () => {
		try {
			await Item.update({ title: 'Nonexistent Item' }, 999999);
			fail('Should have thrown NotFoundError');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** delete */

describe('delete', () => {
	it('should delete an existing item successfully', async () => {
		await Item.delete(testItemIds[0]);

		// Verify item is actually deleted from the database
		const result = await db.query(`SELECT * FROM items WHERE id = $1`, [testItemIds[0]]);
		expect(result.rows.length).toEqual(0);
	});

	it('should throw NotFoundError if item does not exist', async () => {
		try {
			await Item.delete(999999);
			fail('Should have thrown NotFoundError');
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
