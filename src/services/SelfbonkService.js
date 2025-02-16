const {
	addReason,
	getRandomBonkReason,
} = require('../data/selfbonkQueries.js');

class SelfbonkService {
	async addReason(reason, userId) {
		return await addReason(reason, userId);
	}

	async getRandomBonkReason() {
		return await getRandomBonkReason();
	}
}

module.exports = new SelfbonkService();
