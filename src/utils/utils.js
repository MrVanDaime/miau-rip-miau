const logger = require('./logger');

const isValidUrl = async (url) => {
	try {
		const regex = /^(http:\/\/|https:\/\/)/;
		if (!regex.test(url)) return false;

		const response = await fetch(url, { method: 'HEAD' });
		if (!response.ok) return false;

		return true;
	} catch (err) {
		logger.error(`Error validating URL:`, err.message);
		return `Error validating URL:`, err.message;
	}
};

module.exports = { isValidUrl };
