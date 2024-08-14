'use strict';

const request = require('supertest');
const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u2Token, u1Token, testPostIds, testItemIds, testLocationId } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('POST /posts', function () {
	test('Creates a new post', async function () {
		const response = await request(app)
			.post('/posts')
			.send({
				itemId: testItemIds[2],
				locationId: testLocationId[0],
			})
			.set('Authorization', `Bearer ${u1Token}`);

		expect(response.statusCode).toEqual(201);
		expect(response.body).toEqual({
			post: {
				id: expect.any(Number),
				posterUsername: 'u1',
				itemId: testItemIds[2],
				locationId: testLocationId[0],
			},
		});
	});
});

describe('GET /posts', function () {
	test('Gets all posts', async function () {
		const response = await request(app).get('/posts').set('Authorization', `Bearer ${u1Token}`);
		const posts = response.body.posts;

		expect(posts).toHaveLength(2);

		expect(posts[0]).toEqual({
			id: expect.any(Number),
			posterUsername: 'u2',
			itemId: testItemIds[1],
			locationId: testLocationId[0],
			postedAt: expect.any(String),
		});

		expect(posts[1]).toEqual({
			id: expect.any(Number),
			posterUsername: 'u1',
			itemId: testItemIds[0],
			locationId: testLocationId[0],
			postedAt: expect.any(String),
		});
	});

	test('Gets all posts with search filters', async function () {
		const response = await request(app).get('/posts?itemName=2').set('Authorization', `Bearer ${u1Token}`);
		const posts = response.body.posts;

		expect(posts).toHaveLength(1);
		expect(posts[0]).toEqual({
			id: expect.any(Number),
			posterUsername: 'u2',
			itemId: testItemIds[1],
			locationId: testLocationId[0],
			postedAt: expect.any(String),
		});
	});
});

describe('DELETE /posts/:username/:id', function () {
	test('Deletes a post', async function () {
		const response = await request(app).delete(`/posts/${testPostIds[0]}`).set('Authorization', `Bearer ${u1Token}`);
		expect(response.body).toEqual({ deleted: `${testPostIds[0]}` });

		const getResponse = await request(app).get('/posts').set('Authorization', `Bearer ${u1Token}`);
		const posts = getResponse.body.posts;
		expect(posts).toHaveLength(1);
	});
});
