const cron = require('node-cron');
const logger = require('../utils/logger');
const { getGif } = require('../data/gifQueries.js');

const gifCronJob = async (client, channelId, targetId) => {
	cron.schedule(
		'0 12 * * *',
		async () => {
			let foundTarget = '';

			client.guilds.cache.forEach(async (guild) => {
				try {
					const target = await guild.members.fetch(targetId);
					foundTarget = target ? `<@${targetId}>` : '';
				} catch (err) {
					foundTarget = '';
				}
			});

			const channel = client.channels.cache.get(channelId);
			if (channel) {
				const gif = await getGif();
				if (gif) channel.send(`@everyone ${foundTarget} ${gif}`);
			} else {
				logger.info(`Channel with id: ${channelId} was not found!`);
			}
		},
		{
			timezone: 'America/Sao_Paulo',
		},
	);
};

module.exports = { gifCronJob };
