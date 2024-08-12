'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');
const Item = require('./item');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testItemIds, testLocationIds } = require('./_testCommon');

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
			locationId: testLocationIds[0],
			isSold: false,
			description: 'A strong and durable hammer.',
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
            location_id: testLocationIds[0],
            is_sold: false,
            description: 'A strong and durable hammer.',
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
			locationID: testLocationIds[0],
			isSold: false,
			description: updateData.description,
		});

		// Verify item is actually updated in the database
		const result = await db.query(`SELECT * FROM items WHERE id = $1`, [testItemIds[0]]);
		expect(result.rows[0]).toEqual({
			id: testItemIds[0],
			image: '/images/item1.png',
			category: 'Electronics',
			title: updateData.title,
			price: updateData.price,
			location_id: testLocationIds[0],
			is_sold: false,
			description: updateData.description,
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
