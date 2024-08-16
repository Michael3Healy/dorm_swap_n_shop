'use strict';

const db = require('../db');
const { NotFoundError, BadRequestError } = require('../expressError');
const Post = require('./post');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testItemIds, testLocationIds } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', () => {
	it('should create a new post successfully', async () => {
		const newPost = {
			posterUsername: 'u1',
			itemId: testItemIds[1],
			locationId: testLocationIds[1],
		};

		let post = await Post.create(newPost);

		expect(post).toEqual({
			id: expect.any(Number),
			...newPost,
		});

		// Verify post is actually in the database
		const result = await db.query(`SELECT * FROM posts WHERE id = $1`, [post.id]);

		expect(result.rows[0]).toEqual({
			id: post.id,
			poster_username: 'u1',
			item_id: testItemIds[1],
			location_id: testLocationIds[1],
			posted_at: expect.any(Date),
		});
	});
});

/************************************** findAll */

describe('findAll', () => {
	it('should find all posts successfully', async () => {
		const posts = await Post.findAll();
		expect(posts).toEqual([
			{
				id: expect.any(Number),
				posterUsername: 'u1',
				itemId: testItemIds[0],
				locationId: testLocationIds[0],
				postedAt: expect.any(Date),
			},
			{
				id: expect.any(Number),
				posterUsername: 'u1',
				itemId: testItemIds[1],
				locationId: testLocationIds[1],
				postedAt: expect.any(Date),
			},
			{
				id: expect.any(Number),
				posterUsername: 'u2',
				itemId: testItemIds[2],
				locationId: testLocationIds[2],
				postedAt: expect.any(Date),
			},
		]);
	});

	it('should find posts successfully with filters', async () => {
		const posts = await Post.findAll({ posterUsername: '1' });
		expect(posts).toEqual([
			{
				id: expect.any(Number),
				posterUsername: 'u1',
				itemId: testItemIds[0],
				locationId: testLocationIds[0],
				postedAt: expect.any(Date),
			},
			{
				id: expect.any(Number),
				posterUsername: 'u1',
				itemId: testItemIds[1],
				locationId: testLocationIds[1],
				postedAt: expect.any(Date),
			},
		]);
		const posts2 = await Post.findAll({ itemName: 'Lap' });
		expect(posts2).toEqual([
			{
				id: expect.any(Number),
				posterUsername: 'u1',
				itemId: testItemIds[0],
				locationId: testLocationIds[0],
				postedAt: expect.any(Date),
			},
		]);
	});
});

/************************************** get */

describe('get', () => {
	it('should get a post successfully', async () => {
		const posts = await Post.findAll();
		const post = await Post.get(posts[0].id);
		expect(post).toEqual(posts[0]);
	});

	it('should return a NotFoundError if post not found', async () => {
		try {
			await Post.get(-1);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** delete */

describe('delete', () => {
	it('should delete a post successfully', async () => {
		const posts = await Post.findAll();
		await Post.delete(posts[0].id);
		const res = await db.query('SELECT * FROM posts WHERE id = $1', [posts[0].id]);
		expect(res.rows.length).toEqual(0);
	});

	it('should return a NotFoundError if post not found', async () => {
		try {
			await Post.delete(-1);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
