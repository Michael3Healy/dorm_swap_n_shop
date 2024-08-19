const { UnauthorizedError, BadRequestError } = require('../expressError');
const db = require('../db');
const User = require('../models/user');

// Check if user exists and delete transactions if user is not the current user or an admin
async function getUser(username, currUser) {
    const user = await User.get(username);
    if (!user) throw new BadRequestError(`User with username ${username} not found`);
    if (user.username !== currUser.username && !currUser.isAdmin) delete user.transactions;
    return user;
}

module.exports = { getUser };