const Post = require('../models/post');
const Item = require('../models/item');
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

/**
 * Update a post with the given data.
 *
 * if no post is found, a NotFoundError is thrown.
 *
 * if the user does not own the post or the item, an UnauthorizedError is thrown.
 *
 * Returns the updated post.
 */
async function updatePost(username, postId, data) {
	try {
		// Check if user owns the post
		const post = await Post.get(postId);
		if (post.posterUsername !== username) throw new UnauthorizedError('User does not own this post');

		// Check if user owns the item
		const item = await Item.get(post.itemId);
		if (item.ownerUsername !== username) throw new UnauthorizedError('User does not own this item');

        // Check if there is any data to update
        if (Object.keys(data).length === 0) throw new BadRequestError('No update data provided');

		// Proceed with the update
		return await Post.update(postId, data);
	} catch (error) {
		throw error;
	}
}

module.exports = { createPost, updatePost };
