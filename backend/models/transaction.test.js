'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');
const Transaction = require('./transaction');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testPostIds, testLocationIds } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', () => {
	it('should create a new transaction successfully', async () => {
		const newTransaction = {
			postId: testPostIds[0],
			buyerUsername: 'u1',
			sellerUsername: 'u2',
			price: 10.5,
		};
		const transaction = await Transaction.create(newTransaction);

		expect(transaction).toEqual({
			id: expect.any(Number),
			postId: testPostIds[0],
			buyerUsername: 'u1',
			sellerUsername: 'u2',
			price: '10.5',
			transactionDate: expect.any(Date),
		});
	});
});

/************************************** findAll */

describe('findAll', () => {
	it('should return all transactions', async () => {
		const transactions = await Transaction.findAll('u1');
		expect(transactions).toEqual([
			{
				id: expect.any(Number),
				postId: testPostIds[0],
				buyerUsername: 'u1',
				sellerUsername: 'u2',
				price: '10.5',
				transactionDate: expect.any(Date),
			},
			{
				id: expect.any(Number),
				postId: testPostIds[1],
				buyerUsername: 'u1',
				sellerUsername: 'u3',
				price: '20.5',
				transactionDate: expect.any(Date),
			},
		]);
	});

	it('should return filtered transactions', async () => {
		const transactions = await Transaction.findAll('u2', { buyerUsername: 'u2' });
		expect(transactions).toEqual([
			{
				id: expect.any(Number),
				postId: testPostIds[2],
				buyerUsername: 'u2',
				sellerUsername: 'u3',
				price: '15.5',
				transactionDate: expect.any(Date),
			},
		]);

		const transactions2 = await Transaction.findAll('u1', { minPrice: 20, maxPrice: 30 });
		expect(transactions2).toEqual([
			{
				id: expect.any(Number),
				postId: testPostIds[1],
				buyerUsername: 'u1',
				sellerUsername: 'u3',
				price: '20.5',
				transactionDate: expect.any(Date),
			},
		]);
	});

	it('should prevent users from accessing transactions of other users', async () => {
		try {
			const res = await Transaction.findAll('u3', { sellerUsername: 'u2' });
            console.log('res:', res);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
