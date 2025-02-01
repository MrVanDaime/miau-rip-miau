const { addGif, searchGif } = require('../data/gifQueries.js');

class GifService {
	async addGif(gifUrl, userId) {
		return await addGif(gifUrl, userId);
	}

	async gifExists(gifUrl) {
		return await searchGif(gifUrl);
	}
}

module.exports = new GifService();
