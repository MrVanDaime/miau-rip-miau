require('dotenv').config();

// Require the necessary discord.js classes
const validUsers = process.env.USERS.split(',');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const { gifCronJob } = require('./services/gifCronJob');
const { loadCommands } = require('./services/commandLoader');

const logger = require('./utils/logger');
const { createGifsTable } = require('./data/gifQueries.js');
const {
	createSelfbonksTable,
	createSelfbonkReasonsTable,
} = require('./data/selfbonkQueries.js');
const { createCarfigsTable } = require('./data/carfigQueries.js');
const SelfbonkService = require('./services/SelfbonkService');
const CarfigService = require('./services/CarfigService.js');
const token = process.env.DISCORD_TOKEN;
const targetId = process.env.TARGET_ID;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function init() {
	logger.info(`Goodbye leoma cat.`);

	// If not exists
	createGifsTable();
	createSelfbonksTable();
	createSelfbonkReasonsTable();
	createCarfigsTable();

	loadCommands(client);

	// cron service
	gifCronJob(client, targetId);
}

client.on(Events.InteractionCreate, async (interaction) => {
	if (interaction.isButton()) {
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
						`${interaction.guild.id}: SelfBonk channel with id: ${selfbonkChannelId} was not found!`,
					);
					return await interaction.channel.send(`**${nickName}** ${reason}`);
				}
			} catch (err) {
				return await interaction.reply({
					content: 'Infelizmente minha mamãe não está mais entre nós',
				});
			}
		}
	}

	if (!validUsers.includes(interaction.user.id)) {
		return await interaction.reply({
			content:
				'Você precisa doar 66g de cinzas de gato para usar esse comando.',
		});
	}

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		logger.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(
			`There was an error while executing this command: ${error.message}`,
		);
		try {
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: 'Ephemeral',
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: 'Ephemeral',
				});
			}
		} catch (replyError) {
			// Log the reply error if the interaction is unknown or expired
			logger.error(`Failed to respond to interaction: ${replyError.message}`);
		}
	}
});

// Log in to discord with the client's token
client.login(token).then(init);
