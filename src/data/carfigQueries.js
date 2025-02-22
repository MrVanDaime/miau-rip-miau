const logger = require('../utils/logger');
const { getQuery, getAllQuery, runQuery } = require('./dbConnection');

const createCarfigsTable = () => {
	const query = `
    CREATE TABLE IF NOT EXISTS carfigs (
      id INTEGER NOT NULL,
      server_id VARCHAR (20) NOT NULL,
      config VARCHAR(20) NOT NULL,
      value VARCHAR(20) NOT NULL,
			PRIMARY KEY(id)
    )
  `;

	runQuery(query);
};

const getAllCarfigs = (serverId) => {
	try {
		const records = getAllQuery(
			'SELECT config, value FROM carfigs WHERE server_id = ?',
			[serverId],
		);

		if (records) return { error: false, data: records };

		return { error: false, message: 'Nenhuma carfig foi encontrada' };
	} catch (err) {
		logger.error(`Error selecting Carfigs: ${err.message}`);
		return {
			error: true,
			message: `Error selecting Carfigs: ${err.message}`,
		};
	}
};

const getCarfig = (serverId, config) => {
	try {
		const hasConfig = getQuery(
			'SELECT config, value FROM carfigs WHERE server_id = ? AND config = ?',
			[serverId, config],
		);

		if (!hasConfig) return false;

		return { error: false, data: hasConfig };
	} catch (err) {
		logger.error(`Error getting Carfig to database: ${err.message}`);
		return {
			error: true,
			message: `Error getting Carfig to database: ${err.message}`,
		};
	}
};

const setCarfig = async (serverId, config, value) => {
	try {
		const hasConfig = await getCarfig(serverId, config);

		if (hasConfig) {
			runQuery(
				'UPDATE carfigs SET value = ? WHERE server_id = ? AND config = ?',
				[value, serverId, config],
			);

			return { error: false, message: 'Carfig atualizada' };
		} else {
			runQuery(
				'INSERT INTO carfigs (server_id, config, value) VALUES (?, ?, ?)',
				[serverId, config, value],
			);

			return { error: false, message: 'Carfig criada' };
		}
	} catch (err) {
		logger.error(`Error posting Carfig to database: ${err.message}`);
		return {
			error: true,
			message: `Error posting Carfig to database: ${err.message}`,
		};
	}
};

module.exports = {
	createCarfigsTable,
	getAllCarfigs,
	getCarfig,
	setCarfig,
};
