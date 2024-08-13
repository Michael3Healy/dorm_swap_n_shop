'use strict';

const request = require('supertest');
const app = require('../app');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, u2Token, adminToken, testItemIds, testLocationId } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

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
});
