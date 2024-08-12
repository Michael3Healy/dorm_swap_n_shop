'use strict';

const request = require('supertest');
const app = require('../app');
const db = require('../db.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, u1Token, u2Token, adminToken } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe('PATCH /users/:username', function () {
	test('Updates user profile with valid data', async function () {
		const response = await request(app)
			.patch(`/users/u1`)
			.send({
				firstName: 'UpdatedFirstName',
				lastName: 'UpdatedLastName',
				email: 'updateduser1@user.com',
				phoneNumber: '123-456-7890',
				profilePicture: 'http://newprofilepic.img',
			})
			.set('Authorization', `Bearer ${u1Token}`);

		expect(response.status).toBe(201);
		expect(response.body).toEqual({
			username: 'u1',
			firstName: 'UpdatedFirstName',
			lastName: 'UpdatedLastName',
			email: 'updateduser1@user.com',
			phoneNumber: '123-456-7890',
			profilePicture: 'http://newprofilepic.img',
		});
	});

	test('Fails to update user profile with invalid data', async function () {
		const response = await request(app)
			.patch(`/users/u1`)
			.send({
				email: 'invalidemail', // Invalid email format
			})
			.set('Authorization', `Bearer ${u1Token}`);

		expect(response.status).toBe(400);
		expect(response.body.error.message).toContain(`instance.email does not conform to the "email" format`);
	});

	test('Fails if user is not authorized', async function () {
		const response = await request(app)
			.patch(`/users/u1`)
			.send({
				firstName: 'AnotherUpdate',
			})
			.set('Authorization', `Bearer ${u2Token}`); // u2 is not authorized to update u1

		expect(response.status).toBe(401);
	});
});

describe('GET /users', function () {
	test('Gets list of users with no filters', async function () {
		const response = await request(app).get(`/users`).set('Authorization', `Bearer ${u1Token}`);

		expect(response.status).toBe(200);
		expect(response.body.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					username: 'u1',
					firstName: 'U1F',
					lastName: 'U1L',
					email: 'user1@user.com',
				}),
				expect.objectContaining({
					username: 'u2',
					firstName: 'U2F',
					lastName: 'U2L',
					email: 'user2@user.com',
				}),
			])
		);
	});

	test('Gets list of users with rating filter', async function () {
		// Assume users have ratings and you set a rating for testing
		await db.query(`UPDATE users SET rating = 4 WHERE username = 'u1'`);

		const response = await request(app).get(`/users?rating=3`).set('Authorization', `Bearer ${u1Token}`);

		expect(response.status).toBe(200);
		expect(response.body.users).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					email: 'user1@user.com',
					firstName: 'U1F',
					isAdmin: false,
					lastName: 'U1L',
					numRatings: 0,
					phoneNumber: '123-456-1232',
					profilePicture: null,
					rating: '4.00',
					username: 'u1',
				}),
			])
		);
	});

	test('Fails if not logged in', async function () {
		const response = await request(app).get(`/users`);

		expect(response.status).toBe(401);
	});
});

describe('PATCH /users/:username/rating/:seller', function () {
	test('Updates user rating successfully', async function () {
		const response = await request(app).patch(`/users/u1/rating/u2`).send({ rating: 3 }).set('Authorization', `Bearer ${u1Token}`);

		expect(response.status).toBe(200);
		expect(response.body.user).toEqual({
			username: 'u2',
			rating: "3.00",
			numRatings: 1,
		});

		const response2 = await request(app).patch(`/users/u3/rating/u2`).send({ rating: 5 }).set('Authorization', `Bearer ${adminToken}`);

		expect(response2.status).toBe(200);
		expect(response2.body.user).toEqual({
			username: 'u2',
			rating: "4.00",
			numRatings: 2,
		});
	});

	test('Fails to update rating with invalid data', async function () {
		const response = await request(app)
			.patch(`/users/u1/rating/u2`)
			.send({ rating: 6 }) // Invalid rating value
			.set('Authorization', `Bearer ${u1Token}`);

		expect(response.status).toBe(400);
		expect(response.body.error.message).toContain('instance.rating must be less than or equal to 5');
	});

	test('Fails if not authorized', async function () {
		const response = await request(app).patch(`/users/u1/rating/u2`).send({ rating: 3 }).set('Authorization', `Bearer ${u2Token}`); // u2 is not authorized to update ratings for u2

		expect(response.status).toBe(401);
	});
});
