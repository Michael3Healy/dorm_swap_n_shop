const Post = require('../models/post');
const { UnauthorizedError, BadRequestError } = require('../expressError');
const db = require('../db');

async function createPost({ posterUsername, itemId, locationId }) {
	try {
		const duplicateCheck = await db.query(
			`
			SELECT item_id
			FROM posts
			WHERE item_id = $1`,
			[itemId]
		);
		if (duplicateCheck.rows[0]) throw new BadRequestError(`Item with id (${itemId}) has already been posted`);

		const ownershipCheck = await db.query(
			`
			SELECT owner_username
			FROM items
			WHERE id = $1`,
			[itemId]
		);

		if (ownershipCheck.rows[0].owner_username !== posterUsername) throw new UnauthorizedError('User does not own this item');
		
		const post = await Post.create({ posterUsername, itemId, locationId });
		return post;
	} catch (error) {
		throw error;
	}
}

async function deletePost(id, username) {
	const post = await Post.get(id);
	if (post.posterUsername !== username) throw new UnauthorizedError('User does not own this post');

	await Post.delete(id);
}

module.exports = { createPost, deletePost };
