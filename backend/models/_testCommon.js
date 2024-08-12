const bcrypt = require('bcrypt');

const db = require('../db');
const { BCRYPT_WORK_FACTOR } = require('../config');

const testItemIds = [];
const testLocationIds = [];

async function commonBeforeAll() {
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM users');
	// noinspection SqlWithoutWhere
	await db.query('DELETE FROM items');

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
		`INSERT INTO items (image, category, title, price, location_id, is_sold, description)
                    VALUES 
                    ('/images/item1.png', 'Electronics', 'Laptop', 799.99, $1, FALSE, 'A powerful laptop with 16GB RAM and 512GB SSD.'),
                    ('/images/item2.png', 'Furniture', 'Sofa', 299.99, $2, FALSE, 'A comfortable three-seater sofa.'),
                    ('/images/item3.png', 'Books', 'JavaScript Guide', 19.99, $3, TRUE, 'A comprehensive guide to mastering JavaScript.')
                    RETURNING id`,
		[testLocationIds[0], testLocationIds[1], testLocationIds[2]]
	);
	testItemIds.splice(0, 0, ...resultsItems.rows.map(r => r.id));
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
};
