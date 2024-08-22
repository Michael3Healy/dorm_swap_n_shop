const { UnauthorizedError, BadRequestError } = require('../expressError');
const db = require('../db');
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Check if user exists and delete transactions if user is not the current user or an admin
async function getUser(username, currUser) {
	const user = await User.get(username);
	if (!user) throw new BadRequestError(`User with username ${username} not found`);
	if (user.username !== currUser.username && !currUser.isAdmin) delete user.transactions;
	return user;
}

async function updateUser(username, data) {
	const result = await db.query(
		`SELECT password
            FROM users
            WHERE username = $1`,
		[username]
	);

	const password = result.rows[0].password;

	const isValid = await bcrypt.compare(data.password, password);

	if (!isValid) throw new UnauthorizedError('Invalid password');

	delete data.password;

	const user = await User.update(username, data);

	if (!user) throw new BadRequestError(`User with username ${username} not found`);
	return user;
}

module.exports = { getUser, updateUser };
