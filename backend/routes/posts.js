'use strict';

/** Routes for users. */

const jsonschema = require('jsonschema');

const express = require('express');
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require('../middleware/auth');
const { BadRequestError } = require('../expressError');
const postService = require('../services/postService');
const Post = require('../models/post');
const postNewSchema = require('../schemas/posts/postNew.json');
const postSearchSchema = require('../schemas/posts/postSearch.json');

const router = express.Router();

/** POST / { post } => { post }
 *
 * post should be { itemId, locationId }
 *
 * Returns { id, posterUsername, itemId, locationId }
 *
 * Authorization required: logged in
 */
router.post('/', ensureLoggedIn, async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.body, postNewSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const username = res.locals.user.username;
		const post = await postService.createPost({ ...req.body, posterUsername: username });
		return res.status(201).json({ post });
	} catch (err) {
		return next(err);
	}
});

/**
 * GET / => { posts: [ { id, posterUsername, itemId, locationId, postedAt }, ...] }
 *
 * Can filter on provided search filters:
 * - itemName (case-insensitive, partial matches)
 * - posterUsername (case-insensitive, partial matches)
 *
 * Authorization required: none
 */
router.get('/', async function (req, res, next) {
	try {
		const validator = jsonschema.validate(req.query, postSearchSchema);
		if (!validator.valid) {
			const errs = validator.errors.map(e => e.stack);
			throw new BadRequestError(errs);
		}
		const posts = await Post.findAll(req.query);
		return res.json({ posts });
	} catch (err) {
		return next(err);
	}
});

/** GET /[id] => { post }
 *
 * Returns { id, posterUsername, itemId, locationId, postedAt }
 *
 * Authorization required: none
 */

router.get('/:id', async function (req, res, next) {
	try {
		const post = await Post.get(req.params.id);
		return res.json({ post });
	} catch (err) {
		return next(err);
	}
});

/** DELETE /[id]  =>  { deleted: id }
 * 
 * Authorization: correct user or admin
 */
router.delete('/:id', ensureLoggedIn, async function (req, res, next) {
    try {
        const { id } = req.params;
        const username = res.locals.user.username;
        await postService.deletePost(id, username);
        return res.json({ deleted: req.params.id });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
