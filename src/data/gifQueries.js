const logger = require('../utils/logger');
const { getQuery, runQuery } = require('./dbConnection');
const { isValidUrl } = require('../utils/validateUrl');

const createGifsTable = () => {
	const query = `
		CREATE TABLE IF NOT EXISTS gifs (
			id INTEGER NOT NULL,
			gif_url VARCHAR(255) NOT NULL,
			sent BOOLEAN NOT NULL DEFAULT FALSE,
			user_id VARCHAR(20) NOT NULL,
			PRIMARY KEY(id)
		);`;

	runQuery(query);
};

const getGif = async () => {
	try {
		return await getRandomGif();
	} catch (err) {
		logger.error(`Error getting GIF from database: ${err.message}`);
		return `Error getting GIF from database: ${err.message}`;
	}
};

const getRandomGif = async () => {
	while (true) {
		const record = getQuery(
			'SELECT id, gif_url FROM gifs WHERE sent = 0 ORDER BY RANDOM();',
		);

		if (record) {
			const validUrl = await isValidUrl(record.gif_url);
			if (validUrl) {
				runQuery('UPDATE gifs SET sent = 1 WHERE id = ?;', [record.id]);
				return record.gif_url;
			}

			runQuery('DELETE FROM gifs WHERE id = ?;', [record.id]);
		} else {
			runQuery('UPDATE gifs SET sent = 0;');
		}
	}
};

const addGif = async (gif_url, user_id) => {
	try {
		const validUrl = await isValidUrl(gif_url);
		if (!validUrl) return false;

		runQuery('INSERT INTO gifs (gif_url, user_id) VALUES (?, ?)', [
			gif_url,
			user_id,
		]);

		return true;
	} catch (err) {
		logger.error(`Error posting GIF to database: ${err.message}`);
		return {
			error: true,
			message: `Error posting GIF to database: ${err.message}`,
		};
	}
};

const searchGif = async (gif_url) => {
	try {
		const validUrl = await isValidUrl(gif_url);
		if (!validUrl) return false;

		const record = getQuery('SELECT * FROM gifs WHERE gif_url = ?;', [gif_url]);
		return !!record; // true if exists, false otherwise
	} catch (err) {
		logger.error(`Error searching GIF in the database: ${err.message}`);
		return {
			error: true,
			message: `Error searching GIF in the database: ${err.message}`,
		};
	}
};

module.exports = { createGifsTable, getGif, addGif, searchGif };
