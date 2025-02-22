const {
	getAllCarfigs,
	getCarfig,
	setCarfig,
} = require('../data/carfigQueries.js');

class CarfigService {
	async getAllCarfigs(serverId) {
		return await getAllCarfigs(serverId);
	}

	async getCarfig(serverId, config) {
		return await getCarfig(serverId, config);
	}

	async setCarfig(serverId, config, value) {
		return await setCarfig(serverId, config, value);
	}
}

module.exports = new CarfigService();
