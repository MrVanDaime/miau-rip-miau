const logger = require('../utils/logger');
const { getQuery, runQuery } = require('./dbConnection');

const createSelfbonksTable = () => {
	const query = `
		CREATE TABLE IF NOT EXISTS selfbonks (
			id INTEGER NOT NULL,
			user_id VARCHAR(20) NOT NULL,
			nickName VARCHAR(100) NOT NULL,
      reason VARCHAR(100) NOT NULL,
			bonked_at TEXT DEFAULT (datetime('now', '-3 hours')),
			PRIMARY KEY(id)
		);`;

	runQuery(query);
};

const createSelfbonkReasonsTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS selfbonkReasons (
      id INTEGER NOT NULL,
      reason VARCHAR (100) NOT NULL,
      sent BOOLEAN NOT NULL DEFAULT FALSE,
      user_id VARCHAR(20) NOT NULL,
      created_at TEXT DEFAULT (datetime('now', '-3 hours')),
			PRIMARY KEY(id)
    )
  `;

	runQuery(query);
};

const getRandomBonkReason = () => {
	const record = getQuery(
		'SELECT id, reason FROM selfbonkReasons WHERE sent = 0 ORDER BY RANDOM();',
	);

	if (record) {
		runQuery('UPDATE selfbonkReasons SET sent = 1 WHERE id = ?;', [record.id]);
		return record.reason;
	} else {
		runQuery('UPDATE selfbonkReasons SET sent = 0;');
		runQuery('UPDATE selfbonkReasons SET sent = 1 WHERE id = ?;', [record.id]);
		return record.reason;
	}
};

const addReason = (reason, user_id) => {
	try {
		runQuery('INSERT INTO selfbonkReasons (reason, user_id) VALUES (?, ?);', [
			reason,
			user_id,
		]);

		return true;
	} catch (err) {
		logger.error(`Error posting Bonk Reason to database: ${err.message}`);
		return {
			error: true,
			message: `Error posting Bonk Reason to database: ${err.message}`,
		};
	}
};

module.exports = {
	createSelfbonksTable,
	createSelfbonkReasonsTable,
	getRandomBonkReason,
	addReason,
};
