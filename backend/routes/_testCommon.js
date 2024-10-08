'use strict';

const db = require('../db.js');
const User = require('../models/user');
const Item = require('../models/item');
const Post = require('../models/post');
const Transaction = require("../models/transaction");
const { createToken } = require('../helpers/tokens');

let testItemIds = [];
let testPostIds = [];
let testLocationId = [];
const testTransactionIds = [];

async function commonBeforeAll() {
	// Clean up existing data
	await db.query('DELETE FROM transactions');
	await db.query('DELETE FROM posts');
	await db.query('DELETE FROM items');
	await db.query('DELETE FROM users');
	await db.query('DELETE FROM locations');

	// Create test locations
	const locationRes = await db.query(
		`INSERT INTO locations (latitude, longitude, city, state, zip, street)
     VALUES (40.712776, -74.005974, 'New York', 'NY', '10001', '5th Avenue')
     RETURNING id`
	);
	testLocationId[0] = locationRes.rows[0].id;

	// Create test users
	await User.register({
		username: 'u1',
		firstName: 'U1F',
		lastName: 'U1L',
		email: 'user1@user.com',
		password: 'password1',
		isAdmin: false,
		phoneNumber: '123-456-1232',
	});

	await User.register({
		username: 'u2',
		firstName: 'U2F',
		lastName: 'U2L',
		email: 'user2@user.com',
		password: 'password2',
		isAdmin: false,
		phoneNumber: '123-456-9876',
	});

	await User.register({
		username: 'u3',
		firstName: 'U3F',
		lastName: 'U3L',
		email: 'user3@user.com',
		password: 'password3',
		isAdmin: false,
		phoneNumber: '123-456-2347',
	});

	// Create test items
	testItemIds[0] = (
		await Item.create({
			image: 'http://item1.img',
			category: 'Category1',
			title: 'Item1',
			price: 10.0,
			isSold: false,
			description: 'Description for item 1',
			ownerUsername: 'u1',
		})
	).id;

	testItemIds[1] = (
		await Item.create({
			image: 'http://item2.img',
			category: 'Category2',
			title: 'Item2',
			price: 20.0,
			isSold: false,
			description: 'Description for item 2',
			ownerUsername: 'u2',
		})
	).id;

	testItemIds[2] = (
		await Item.create({
			image: 'http://item3.img',
			category: 'Category3',
			title: 'Item3',
			price: 30.0,
			isSold: false,
			description: 'Description for item 3',
			ownerUsername: 'u1',
		})
	).id;

	testPostIds[0] = (
		await Post.create({
			posterUsername: 'u1',
			itemId: testItemIds[0],
			locationId: testLocationId[0],
		})
	).id;

	testPostIds[1] = (
		await Post.create({
			posterUsername: 'u2',
			itemId: testItemIds[1],
			locationId: testLocationId[0],
		})
	).id;

	// Create test transactions
	testTransactionIds[0] = (
		await Transaction.create({
			sellerUsername: 'u1',
			buyerUsername: 'u2',
			postId: testPostIds[0],
			price: 10.0,
			transactionDate: new Date(),
		})
	).id;
}

async function commonBeforeEach() {
	await db.query('BEGIN');
}

async function commonAfterEach() {
	await db.query('ROLLBACK');
}

async function commonAfterAll() {
	await db.end();
}

const u1Token = createToken({ username: 'u1', isAdmin: false });
const u2Token = createToken({ username: 'u2', isAdmin: false });
const adminToken = createToken({ username: 'admin', isAdmin: true });

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	testItemIds,
	testPostIds,
	testLocationId,
	testTransactionIds,
	u1Token,
	u2Token,
	adminToken,
};
