const SelfbonkService = require('../services/SelfbonkService');
const CarfigService = require('../services/CarfigService.js');
const logger = require('../utils/logger.js');

const handleButtonInteractions = async (interaction, validUsers, client) => {
	if (interaction.customId === 'confirmselfbonk') {
		const userId = interaction.user.id;
		const nickName = interaction.user.globalName;

		if (validUsers.includes(userId)) {
			return interaction.reply({
				content: 'You fren',
				flags: 'Ephemeral',
			});
		}

		try {
			const reason = await SelfbonkService.getRandomBonkReason();

			await interaction.guild.members.kick(userId, {
				reason: `Selfbonk: ${reason}`,
			});

			await SelfbonkService.saveSelfbonk(userId, nickName, reason);
			const selfbonkChannelId = await CarfigService.getCarfig(
				interaction.guild.id,
				'selfbonk',
			);

			const selfbonkChannel = client.channels.cache.get(
				selfbonkChannelId.data.value,
			);
			if (selfbonkChannel) {
				return await selfbonkChannel.send(`**${nickName}** ${reason}`);
			} else {
				logger.info(
					`${interaction.guild.id}: SelfBonk channel with id: ${selfbonkChannelId.data.value} was not found!`,
				);
				return await interaction.channel.send(`**${nickName}** ${reason}`);
			}
		} catch (err) {
			logger.error(`There was a problem running selfbonk: ${err.message}`);
			return await interaction.reply({
				content: 'Infelizmente minha mamãe não está mais entre nós',
			});
		}
	}
};

module.exports = { handleButtonInteractions };
