import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3001';

class ShopApi {
	// token for interacting with the API
	static token;

	// function to send a request to the API
	static async request(endpoint, data = {}, method = 'get') {
		console.debug('API Call:', endpoint, data, method);

		const url = `${BASE_URL}/${endpoint}`;
		const headers = { Authorization: `Bearer ${ShopApi.token}` };
		const params = method === 'get' ? data : {};

		try {
			return (await axios({ url, method, data, params, headers })).data;
		} catch (err) {
			console.error('API Error:', err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// Individual API routes

	// Auth routes

	/** Log in a user
	 *
	 * { username, password } => token
	 */
	static async login(username, password) {
		let res = await this.request('auth/token', { username, password }, 'post');
		return res.token;
	}

	/** Register a new user
	 *
	 * { username, password, firstName, lastName, email, isAdmin, phoneNumber, profilePicture } => token
	 */
	static async register(userData) {
		let res = await this.request('auth/register', userData, 'post');
		return res.token;
	}

	// User routes

	/** Get data about user by username
	 *
	 * username => { username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture, rating, numRatings, posts, transactions }
	 */
	static async getUser(username) {
		let res = await this.request(`users/${username}`);
		return res.user;
	}

	/** Get users data
	 *
	 * optional searchParams: { username, rating }
	 *
	 * Returns { users: [{ username, firstName, lastName, phoneNumber, email, isAdmin, profilePicture }, ...]}
	 */
	static async getUsers(searchParams) {
		let res = await this.request('users', searchParams);
		return res.users;
	}

	/** Update user data
	 *
	 * {email, firstName, lastName, phoneNumber, profilePicture, password } => user
	 *
	 * Returns { username, firstName, lastName, email, phoneNumber, profilePicture }}
	 */
	static async updateUser(username, userData) {
		let res = await this.request(`users/${username}`, userData, 'patch');
		return res.user;
	}

	/** Rate a user
	 *
	 * { rating } =>{ username, rating, numRatings }
	 */
	static async rateUser(buyerUsername, sellerUsername, rating) {
		let res = await this.request(`users/${buyerUsername}/rating/${sellerUsername}`, { rating }, 'patch');
		return res;
	}

	// Item routes

	/** Add an item to the database
	 *
	 * { image, category, title, price, isSold, description } => item
	 */

	static async addItem(itemData) {
		let res = await this.request('items', itemData, 'post');
		return res.item;
	}

	/** Get item by id
	 *
	 * itemId => { id, image, category, title, price, isSold, description, ownerUsername }
	 */
	static async getItem(itemId) {
		let res = await this.request(`items/${itemId}`);
		return res.item;
	}

	/** Update an item
	 *
	 * { itemId, itemData: {image, category, title, price, isSold, description} } => item
	 */
	static async updateItem(itemId, itemData) {
		let res = await this.request(`items/${itemId}`, itemData, 'patch');
		return res.item;
	}

	/** Delete an item
	 *
	 * itemId => message
	 */
	static async deleteItem(itemId) {
		let res = await this.request(`items/${itemId}`, {}, 'delete');
		return res.message;
	}

	// Posts Routes

	/** Create new post
	 *
	 * { posterUsername, itemId, locationId } => post
	 *
	 * where post is { id, posterUsername, itemId, locationId }
	 */
	static async createPost(posterUsername, itemId, locationId) {
		let res = await this.request('posts', { posterUsername, itemId, locationId }, 'post');
		return res.post;
	}

	/** Get all posts
	 *
	 * optional searchParams: { itemName, posterUsername }
	 *
	 * Returns [ { id, posterUsername, itemId, locationId, postedAt }, ...]
	 */
	static async getPosts(searchParams) {
		let res = await this.request('posts', searchParams);
		return res.posts;
	}

	/** Get a post by id
	 *
	 * postId => { id, posterUsername, itemId, locationId, postedAt }
	 */
	static async getPost(postId) {
		let res = await this.request(`posts/${postId}`);
		return res.post;
	}

	/** Delete a post
	 *
	 * postId => { deleted: postId }
	 */
	static async deletePost(postId) {
		let res = await this.request(`posts/${postId}`, {}, 'delete');
		return res;
	}

	// Location routes

	/** Add new location
	 *
	 * { street, city, state } => location
	 */
	static async addLocation(locationData) {
		let res = await this.request('locations', locationData, 'post');
		return res.location;
	}

	/** Get all locations
	 *
	 * optional searchParams: { city, state, street }
	 *
	 * Returns [ { id, street, city, state, zip, latitude, longitude }, ...]
	 */
	static async getLocations(searchParams) {
		let res = await this.request('locations', searchParams);
		return res.locations;
	}

	/** Get location by id
	 *
	 * locationId => { id, street, city, state, zip, latitude, longitude }
	 */
	static async getLocation(locationId) {
		let res = await this.request(`locations/${locationId}`);
		return res.location;
	}

	/** Delete location
	 *
	 * locationId => { deleted: locationId }
	 */
	static async deleteLocation(locationId) {
		let res = await this.request(`locations/${locationId}`, {}, 'delete');
		return res;
	}

	// Transaction routes

	/** Create new transaction
	 *
	 * { postId, buyerUsername, sellerUsername, price } => transaction
	 *
	 * where transaction is { id, postId, buyerUsername, sellerUsername, price, transactionDate }
	 */
	static async createTransaction(postId, buyerUsername, sellerUsername, price) {
		let res = await this.request('transactions', { postId, buyerUsername, sellerUsername, price }, 'post');
		return res.transaction;
	}

	/** Get all transactions
	 *
	 * optional searchParams: { buyerUsername, sellerUsername, minPrice, maxPrice, transactionDate }
	 *
	 * Returns [ { id, postId, buyerUsername, sellerUsername, price, transactionDate }, ...]
	 */
	static async getTransactions(searchParams) {
		let res = await this.request('transactions', searchParams);
		return res.transactions;
	}

	/** Get transaction by id
	 *
	 * transactionId => { id, postId, buyerUsername, sellerUsername, price, transactionDate }
	 */
	static async getTransaction(transactionId) {
		let res = await this.request(`transactions/${transactionId}`);
		return res.transaction;
	}

	static async markTransactionAsRated(transactionId) {
		let res = await this.request(`transactions/${transactionId}`, {}, 'patch');
		return res;
	}
}

export default ShopApi;
