const logger = require('./logger');

const isValidUrl = async (url) => {
	try {
		const regex = /^(http:\/\/|https:\/\/)/;
		if (!regex.test(url)) return false;

		const response = await fetch(url, { method: 'HEAD' });
		return response.ok;
	} catch (err) {
		const errorMessage = `Error validating URL: ${err.message}`;
		logger.error(errorMessage);
		return errorMessage;
	}
};

module.exports = { isValidUrl };
