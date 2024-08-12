'use strict';

const db = require('../db.js');
const User = require('../models/user');
const Item = require('../models/item');
// const Post = require("../models/post");
// const Transaction = require("../models/transaction");
const { createToken } = require('../helpers/tokens');

// const testItemIds = [];
// const testPostIds = [];
// const testTransactionIds = [];

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
	const testLocationId = locationRes.rows[0].id;

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
}
// Create test items
//   testItemIds.push((await Item.create({
//     image: "http://item1.img",
//     category: "Category1",
//     title: "Item1",
//     price: 10.00,
//     locationId: testLocationId,
//     isSold: false,
//     description: "Description for item 1"
//   })).id);

//   testItemIds.push((await Item.create({
//     image: "http://item2.img",
//     category: "Category2",
//     title: "Item2",
//     price: 20.00,
//     locationId: testLocationId,
//     isSold: false,
//     description: "Description for item 2"
//   })).id);

//   // Create test posts
//   testPostIds.push((await Post.create({
//     posterUsername: "u1",
//     itemId: testItemIds[0],
//     locationId: testLocationId,
//     postedAt: new Date()
//   })).id);

//   testPostIds.push((await Post.create({
//     posterUsername: "u2",
//     itemId: testItemIds[1],
//     locationId: testLocationId,
//     postedAt: new Date()
//   })).id);

//   // Create test transactions
//   testTransactionIds.push((await Transaction.create({
//     sellerUsername: "u1",
//     buyerUsername: "u2",
//     itemId: testItemIds[0],
//     price: 10.00,
//     transactionDate: new Date()
//   })).id);
// }

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
	//   testItemIds,
	//   testPostIds,
	//   testTransactionIds,
	u1Token,
	u2Token,
	adminToken,
};
