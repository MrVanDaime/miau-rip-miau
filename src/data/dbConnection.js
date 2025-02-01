const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../utils/logger');

let db;

const dbConnection = () => {
	if (!db) {
		try {
			db = new Database(path.join(__dirname, './database.db'));
		} catch (err) {
			logger.error(`Database connection failed: ${err.message}`);
			return {
				error: true,
				message: `Database connection failed: ${err.message}`,
			};
		}
	}
	return db;
};

const runQuery = (query, params = []) => {
	const db = dbConnection();

	try {
		return db.prepare(query).run(params);
	} catch (err) {
		logger.error(`Query running failed: ${err.message}`);
		return { error: true, message: `Query running failed: ${err.message}` };
	}
};

// get single row
const getQuery = (query, params = []) => {
	const db = dbConnection();

	try {
		return db.prepare(query).get(params);
	} catch (err) {
		logger.error(`Query getting failed: ${err.message}`);
		return { error: true, message: `Query getting failed: ${err.message}` };
	}
};

module.exports = { dbConnection, runQuery, getQuery };
