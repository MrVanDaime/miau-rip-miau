const {
	addReason,
	getRandomBonkReason,
	saveSelfbonk,
} = require('../data/selfbonkQueries.js');

class SelfbonkService {
	async addReason(reason, userId) {
		return await addReason(reason, userId);
	}

	async getRandomBonkReason() {
		return await getRandomBonkReason();
	}

	async saveSelfbonk(userId, nickName, reason) {
		return await saveSelfbonk(userId, nickName, reason);
	}
}

module.exports = new SelfbonkService();
