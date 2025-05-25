const cron = require('node-cron');
const logger = require('../utils/logger');
const { getGif } = require('../data/gifQueries.js');
const CarfigService = require('../services/CarfigService.js');

const gifCronJob = async (client, targetId) => {
	cron.schedule(
		'0 12 * * *',
		async () => {
			for (const guild of client.guilds.cache.values()) {
				const target = await findUser(guild, targetId);
				const foundTarget = target ? `<@${target.id}>` : '';

				const dailyCatChannel = await CarfigService.getCarfig(
					guild.id,
					'dailycat',
				);

				let channelId;
				if (dailyCatChannel) {
					channelId = dailyCatChannel.data.value;
					const channel = client.channels.cache.get(channelId);
					if (channel) {
						const gif = await getGif();
						if (gif) channel.send(`${foundTarget} ${gif}`);
					}
				} else {
					logger.info(
						`${guild.id}: Channel with id: ${channelId} was not found!`,
					);
				}
			}
		},
		{
			timezone: 'America/Sao_Paulo',
		},
	);
};

const findUser = async (guild, userId) => {
	try {
		return await guild.members.fetch(userId);
	} catch {
		return false;
	}
};

module.exports = { gifCronJob };
