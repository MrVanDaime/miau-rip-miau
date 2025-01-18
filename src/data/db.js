const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../utils/logger');
const { isValidUrl } = require('../utils/utils');

const dbConnection = () => {
	try {
		const db = new Database(path.join(__dirname, './database.db'));

		return db;
	} catch (err) {
		logger.error(`Database connection failed: ${err.message}`);
		return `Database connection failed: ${err.message}`;
	}
};

const createTable = () => {
	try {
		run_query(
			`CREATE TABLE IF NOT EXISTS gifs (
				id INTEGER NOT NULL,
				gif_url VARCHAR(255) NOT NULL,
				sent BOOLEAN NOT NULL DEFAULT FALSE,
				user_id VARCHAR(20) NOT NULL,
				PRIMARY KEY(id)
			);`,
		);
	} catch (err) {
		logger.error(`Table creation failed: ${err.message}`);
		return `Table creation failed: ${err.message}`;
	}
};

const run_query = (query, params = []) => {
	const db = dbConnection();

	try {
		return db.prepare(query).run(params);
	} catch (err) {
		logger.error(`Query running failed: ${err.message}`);
		return `Query running failed: ${err.message}`;
	} finally {
		db.close();
	}
};

// get single row
const get_query = (query, params = []) => {
	const db = dbConnection();

	try {
		return db.prepare(query).get(params);
	} catch (err) {
		logger.error(`Query getting failed: ${err.message}`);
		return `Query getting failed: ${err.message}`;
	} finally {
		db.close();
	}
};

// actions
const getGif = async () => {
	try {
		const record = get_query(
			'SELECT id, gif_url FROM gifs WHERE sent = 0 ORDER BY RANDOM();',
		);

		if (record) {
			const validUrl = await isValidUrl(record.gif_url);
			if (!validUrl) return false;

			run_query('UPDATE gifs SET sent = 1 WHERE id = ?;', [record.id]);
			return record.gif_url;
		} else {
			run_query('UPDATE gifs SET sent = 0;');

			const newRecord = get_query(
				'SELECT id, gif_url FROM gifs WHERE sent = 0 ORDER BY RANDOM();',
			);

			const validUrl = await isValidUrl(newRecord.gif_url);
			if (!validUrl) return false;

			run_query('UPDATE gifs SET sent = 1 WHERE id = ?;', [newRecord.id]);
			return newRecord.gif_url;
		}
	} catch (err) {
		logger.error(`Error getting GIF from database: ${err.message}`);
		return `Error getting GIF from database: ${err.message}`;
	}
};

const addGif = async (gif_url, user_id) => {
	try {
		const validUrl = await isValidUrl(gif_url);
		if (!validUrl) return false;

		run_query('INSERT INTO gifs (gif_url, user_id) VALUES (?, ?)', [
			gif_url,
			user_id,
		]);

		return true;
	} catch (err) {
		logger.error(`Error posting GIF to database: ${err.message}`);
		return `Error posting GIF to database: ${err.message}`;
	}
};

const searchGif = async (gif_url) => {
	try {
		const validUrl = await isValidUrl(gif_url);
		if (!validUrl) return false;

		const record = get_query('SELECT * FROM gifs WHERE gif_url = ?;', [
			gif_url,
		]);

		return record ? true : false;
	} catch {
		logger.error(`Error searching GIF in the database: ${err.message}`);
		return `Error searching GIF in the database: ${err.message}`;
	}
};

module.exports = { dbConnection, createTable, getGif, addGif, searchGif };
