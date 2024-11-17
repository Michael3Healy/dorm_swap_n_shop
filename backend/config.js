'use strict';

/** Shared config for application; can be required many places. */

require('dotenv').config();
require('colors');

const SECRET_KEY = process.env.SECRET_KEY || 'secret-dev';

const USERNAME = process.env.USERNAME;
const PASSWORD = process.env.PASSWORD;

const PORT = +process.env.PORT || 3001;

// Attach AWS S3 bucket for saving photos uploaded by users
const { S3Client } = require('@aws-sdk/client-s3');
const s3 = new S3Client({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
});

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
	return process.env.NODE_ENV === 'test' ? `postgresql://${USERNAME}:${PASSWORD}@localhost/dorm_shop_test` : process.env.DATABASE_URL || `postgresql://${USERNAME}:${PASSWORD}@localhost/dorm_shop`;
}

let database = process.env.NODE_ENV === 'test' ? 'dorm_shop_test' : 'dorm_shop';

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === 'test' ? 1 : 12;

if (process.env.NODE_ENV !== 'test') {
	console.log('dorm_shop Config:'.green);
	console.log('PORT:'.yellow, PORT.toString());
	console.log('BCRYPT_WORK_FACTOR'.yellow, BCRYPT_WORK_FACTOR);
	console.log('Database:'.yellow, database);
	console.log('---');
}

module.exports = {
	SECRET_KEY,
	PORT,
	BCRYPT_WORK_FACTOR,
	getDatabaseUri,
	s3,
};
