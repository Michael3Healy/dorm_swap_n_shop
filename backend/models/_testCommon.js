const bcrypt = require('bcrypt');

const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');

const testItemIds = [];
const testLocationIds = [];
const testPostIds = [];

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM items');
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM locations');
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM posts');
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM transactions');

	await db.query(
		`
        INSERT INTO users(username, password, first_name, last_name, email, is_admin, phone_number, rating, num_ratings)
        VALUES 
        ('u1', $1, 'Mickey', 'Mouse', 'mickey_mouse@yahoo.com', true, '123-456-7890', 4.5, 2),
        ('u2', $2, 'Bowser', 'Koopa', 'bowser@gmail.com', false, '987-654-3210', 3.5, 2),
        ('u3', $3, 'Peach', 'Toadstool', 'peach@gmail.com', false, '123-456-7890', 5, 1)
    `,
		[await bcrypt.hash('password1', BCRYPT_WORK_FACTOR), await bcrypt.hash('password2', BCRYPT_WORK_FACTOR), await bcrypt.hash('password3', BCRYPT_WORK_FACTOR)]
	);

	const resultsLocations = await db.query(`INSERT INTO locations (latitude, longitude, city, state, zip, street)
                    VALUES 
                    (37.774929, -122.419418, 'San Francisco', 'CA', '94103', '123 Market St'),
                    (34.052235, -118.243683, 'Los Angeles', 'CA', '90013', '456 Broadway St'),
                    (40.712776, -74.005974, 'New York', 'NY', '10001', '789 Wall St')
                    RETURNING id`);
	testLocationIds.splice(0, 0, ...resultsLocations.rows.map(r => r.id));

	const resultsItems = await db.query(
		`INSERT INTO items (image, category, title, price, is_sold, description, owner_username)
                    VALUES 
                    ('/images/item1.png', 'Electronics', 'Laptop', 799.99, FALSE, 'A powerful laptop with 16GB RAM and 512GB SSD.', 'u1'),
                    ('/images/item2.png', 'Furniture', 'Sofa', 299.99, FALSE, 'A comfortable three-seater sofa.', 'u2'),
                    ('/images/item3.png', 'Books', 'JavaScript Guide', 19.99, TRUE, 'A comprehensive guide to mastering JavaScript.', 'u3')
                    RETURNING id`,
	);
	testItemIds.splice(0, 0, ...resultsItems.rows.map(r => r.id));

	const resultsPosts = await db.query(
		`INSERT INTO posts (poster_username, item_id, location_id, posted_at)
					VALUES 
					('u1', $1, $2, '2024-03-10T17:00:00Z'),
					('u1', $3, $4, '2023-03-10T18:00:00Z'),
					('u2', $5, $6, '2022-03-10T19:00:00Z')
					RETURNING id`,
		[testItemIds[0], testLocationIds[0], testItemIds[1], testLocationIds[1], testItemIds[2], testLocationIds[2]
		]
	);
	testPostIds.splice(0, 0, ...resultsPosts.rows.map(r => r.id));
	
	await db.query(
		`INSERT INTO transactions (post_id, buyer_username, seller_username, price)
					VALUES 
					($1, 'u1', 'u2', 10.5),
					($2, 'u1', 'u3', 20.5),
					($3, 'u2', 'u3', 15.5)
					`,
		[testPostIds[0], testPostIds[1], testPostIds[2]]
	);
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

module.exports = {
	commonBeforeAll,
	commonBeforeEach,
	commonAfterEach,
	commonAfterAll,
	testItemIds,
	testLocationIds,
	testPostIds
};
